// src/app/api/wallet/payeer-callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';

export async function POST(req: NextRequest) {
  await dbConnect();
  const form = await req.formData();
  const orderId = form.get('m_orderid') as string;
  const status  = form.get('m_status') as string;

  // Find the user/txn
  const user = await UserModel.findOne({ 'transactions._id': orderId });
  if (!user) return new NextResponse('ERROR', { status: 400 });

  const txn = user.transactions.id(orderId)!;
  if (txn.status !== 'pending') return new NextResponse('OK');

  if (status === 'success') {
    txn.status = 'completed';
    await user.save();

    // Credit USD balance
    const wallet = await Wallet.findOne({ userId: user._id });
    if (wallet) {
      wallet.balance += txn.amountUsd;
      await wallet.save();
    }
  } else {
    txn.status = 'failed';
    await user.save();
  }

  return new NextResponse('OK');
}
