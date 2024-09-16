// src/app/api/wallet/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';

const PAYEER_API_URL = 'https://payeer.com/api';
const PAYEER_SHOP_ID = process.env.PAYEER_SHOP_ID;
const PAYEER_SECRET_KEY = process.env.PAYEER_SECRET_KEY;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  const { amount, accountNumber, currency = 'USD' } = await req.json();

  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  if (user.balance < amount) {
    return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
  }

  // Create withdrawal request
  try {
    const response = await fetch(`${PAYEER_API_URL}/withdraw`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        account: process.env.PAYEER_ACCOUNT,
        apiId: process.env.PAYEER_API_ID,
        apiPass: process.env.PAYEER_API_SECRET,
        shop_id: PAYEER_SHOP_ID,
        amount: amount,
        currency,
        account_number: accountNumber, // Target Payeer account
        description: 'Withdrawal from wallet',
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ success: false, message: 'Withdrawal failed' });
    }

    // Update user balance and save the transaction
    user.balance -= amount;
    user.transactions.push({ type: 'withdrawal', amount, status: 'completed' });
    await user.save();

    return NextResponse.json({ success: true, balance: user.balance });
  } catch (error) {
    console.error('Withdrawal error:', error);
    return NextResponse.json({ message: 'Error processing withdrawal' }, { status: 500 });
  }
}
