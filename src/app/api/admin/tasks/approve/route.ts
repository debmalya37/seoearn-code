// src/app/api/tasks/approve/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { PlatformFee } from '@src/models/platformFeeModel';
import { AdsRevenue } from '@src/models/adsRevenueModel';
import { deductFromWallet } from '@src/lib/walletUtils';

const PLATFORM_FEE_RATE = 0.20;

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { taskId } = await req.json();

    const task = await Task.findById(taskId);
    if (!task) return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    if (task.isApproved) return NextResponse.json({ success: false, message: 'Task already approved' }, { status: 400 });

    const user = await UserModel.findById(task.createdBy);
    const wallet = await Wallet.findOne({ userId: user._id });

    const grossBudget = Number((task.budget / (1 - PLATFORM_FEE_RATE)).toFixed(2));
    const feeAmount = Number((grossBudget * PLATFORM_FEE_RATE).toFixed(2));
    const netBudget = grossBudget - feeAmount;

    if (wallet.balance < grossBudget) {
      return NextResponse.json({ success: false, message: 'Insufficient wallet balance' }, { status: 400 });
    }

    await deductFromWallet(user._id.toString(), grossBudget, 'Task approval');

    // Update task
    task.budget = netBudget;
    task.isApproved = true;
    task.status = 'In Progress';
    await task.save();

    // Record fees
    await PlatformFee.create({
      userId: user._id,
      taskId: task._id,
      grossBudget,
      feeAmount,
      netBudget,
      createdAt: new Date(),
    });

    await AdsRevenue.create({
      userId: user._id,
      email: user.email,
      taskId: task._id,
      grossBudget,
      feeAmount,
      netBudget,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'Task approved and wallet updated' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
