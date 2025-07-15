// src/app/api/tasks/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { PlatformFee } from '@src/models/platformFeeModel';
import { AdsRevenue }  from '@src/models/adsRevenueModel'; 
import { deductFromWallet } from '@src/lib/walletUtils';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { Types } from 'mongoose';
const PLATFORM_FEE_RATE = 0.20; // 20%

interface NewTaskBody {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: number;
  reward: number;
  budget: number;
  status?: string;
  maxUsersCanDo?: number;
  is18Plus?: boolean; // ✅ Add this line
}


// GET handler (unchanged filtering / pagination)
export async function GET(request: Request) {
  try {
    await dbConnect();
    const url = new URL(request.url);
    const query = url.searchParams;

    const statusFilter = query.get('status') || '';
    const category = query.get('category') || '';
    const duration = query.get('duration') || '';
    const reward = query.get('reward') || '';
    const sortBy = query.get('sortBy') || 'createdAt';
    const page = parseInt(query.get('page') || '1', 10);
    const limit = parseInt(query.get('limit') || '10', 10);

    const filter: any = {};
    if (statusFilter && statusFilter !== 'all') filter.status = statusFilter;
    if (category && category !== 'all') filter.category = category;
    if (duration) filter.duration = { $lte: Number(duration) };
    if (reward) filter.reward = { $gte: Number(reward) };

    const sortOptions: Record<string, 1 | -1> = {};
    if (sortBy === 'createdAt') sortOptions.createdAt = -1;
    else if (sortBy === '-createdAt') sortOptions.createdAt = 1;
    else if (sortBy === 'reward') sortOptions.reward = -1;
    else if (sortBy === '-reward') sortOptions.reward = 1;

    const totalTasks = await Task.countDocuments(filter);
    const tasks = await Task.find(filter)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return NextResponse.json({ success: true, totalTasks, tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch tasks' }, { status: 500 });
  }
}

// POST handler with wallet + fee logic
export async function POST(request: Request) {
  try {
    await dbConnect();

    // 1) Auth
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }

    // 2) Find user & wallet
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
    const wallet = await Wallet.findOne({ userId: user._id.toString() });
    if (!wallet) {
      return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
    }

    // 3) Parse & coerce
    const body = await request.json() as NewTaskBody;
    const title       = body.title;
    const description = body.description;
    const rating      = Number(body.rating);
    const category    = body.category;
    const duration    = Number(body.duration);
    const reward      = Number(body.reward);
    const grossBudget = Number(body.budget);
    const status      = body.status || 'Pending';
    const is18Plus    = Boolean(body.is18Plus);

    // 4) Validate
    if (
      !title ||
      !description ||
      !category ||
      isNaN(duration)  || duration  <= 0 ||
      isNaN(reward)    || reward    <= 0 ||
      isNaN(grossBudget) || grossBudget <= 0
    ) {
      return NextResponse.json({ success: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    // 5) Ensure funds
    if (wallet.balance < grossBudget) {
      return NextResponse.json(
        { success: false, message: 'Insufficient wallet balance for this budget' },
        { status: 400 }
      );
    }

    // 6) Compute fee & net
const feeAmount = parseFloat((grossBudget * PLATFORM_FEE_RATE).toFixed(2));
const netBudget = parseFloat((grossBudget - feeAmount).toFixed(2));

// 7) Create Task with isApproved = false
const maxUsers = Math.max(Math.floor(netBudget / reward), 1);
const newTask = await Task.create({
  title,
  description,
  rating,
  category,
  duration,
  reward,
  budget: netBudget,
  status,
  createdBy: user._id,
  maxUsersCanDo: maxUsers,
  createdAt: new Date(),
  is18Plus,   // Assuming default is false, can be changed based on user input
  isApproved: false,
  isRejected: false,
});

// 8) Link task to user
user.tasks = user.tasks || [];
user.tasks.push(newTask._id);
await user.save();

return NextResponse.json({ success: true, message: 'Task submitted for admin approval', task: newTask }, { status: 201 });

  } catch (error) {
    console.error('Failed to create task:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
