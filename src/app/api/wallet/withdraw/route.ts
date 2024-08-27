import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options'; 

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { amount } = await req.json();

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.balance < amount) {
      return NextResponse.json({ message: 'Insufficient funds' }, { status: 400 });
    }

    user.balance -= amount;
    await user.save();

    return NextResponse.json({ message: 'Withdrawal successful', balance: user.balance }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
