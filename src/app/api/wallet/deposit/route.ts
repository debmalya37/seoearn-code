// src/app/api/wallet/deposit/route.ts
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
  const { amount } = await req.json();

  if (amount < 20) {
    return NextResponse.json({ message: 'Minimum deposit amount is $20' }, { status: 400 });
  }

  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  // Create an invoice request
  try {
    const response = await fetch(`${PAYEER_API_URL}/invoice`, {
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
        currency: 'USD',
        description: 'Deposit to Wallet',
        order_id: user._id.toString(), // Your internal user ID as the order ID
        ip: req.headers.get('x-forwarded-for') || req.headers.get('host'), // User's IP address
        success_url: `${process.env.NEXT_PUBLIC_API_URL}/wallet/success`,
        fail_url: `${process.env.NEXT_PUBLIC_API_URL}/wallet/fail`,
      }),
    });

    const data = await response.json();
    if (!data.success) {
      return NextResponse.json({ success: false, message: 'Failed to create deposit invoice' });
    }

    return NextResponse.json({ success: true, redirectURL: data.data.invoice_url });
  } catch (error) {
    console.error('Deposit error:', error);
    return NextResponse.json({ success: false, message: 'Error creating deposit invoice' }, { status: 500 });
  }
}
