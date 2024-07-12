import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const session = await getServerSession( authOptions);
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

    user.totalAmount = (user.totalAmount || 0) + amount;
    await user.save();

    return NextResponse.json({ message: 'Deposit successful', totalAmount: user.totalAmount }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
