// src/app/api/wallet/deposit.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { amount } = await req.json();

    if (amount < 20) {
      return NextResponse.json({ message: 'Minimum deposit amount is $20' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.balance = (user.balance || 0) + amount;
    
    // Push the transaction into the user's transactions array
    user.transactions.push({
      type: 'deposit',
      amount,
      status: 'completed',
    });

    await user.save();

    return NextResponse.json({ message: 'Deposit successful', balance: user.balance }, { status: 200 });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
