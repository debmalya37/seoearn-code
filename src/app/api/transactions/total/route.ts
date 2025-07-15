// src/app/api/transactions/total/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../../auth/[...nextauth]/options';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

export async function GET(req: NextRequest) {
  // 1. Authenticate
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  // 2. Fetch user's transactions
  await dbConnect();
  const user = await UserModel
    .findById(session.user._id)
    .select('transactions')
    .lean() as { transactions: { amount: number; status: string }[] } | null;

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  // Only keep transactions whose status is "completed"
  const completedTx = user.transactions.filter(
    (tx) => tx.status.toLowerCase() === 'completed'
  );

  // Sum their absolute amounts
  const totalValue = completedTx.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

  return NextResponse.json({
    success: true,
    totalValue,
  });
}
