// src/app/api/wallet/transactions.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const userEmail = session.user.email;

    const user = await UserModel.findOne({ email: userEmail }).populate('transactions').exec();
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const transactions = user.transactions?.sort((a:any, b:any) => b.date - a.date) || [];
    console.log( "transactions : ", transactions);

    return NextResponse.json({ success: true, transactions }, { status: 200 });
  } catch (error) {
    console.error('Fetch transactions error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch transactions' }, { status: 500 });
  }
}
