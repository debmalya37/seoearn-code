// src/app/api/admin/withdrawals/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

// GET /api/admin/withdrawals
export async function GET(_: NextRequest) {
  await dbConnect();

  // 1. Fetch all users who have any withdrawal transactions (pending, approved, rejected)
  const users = await UserModel.find({ 'transactions.type': 'withdrawal' }).lean();

  // 2. Flatten transactions
  const withdrawals = users.flatMap(user =>
    (user.transactions || [])
      .filter((txn:any) => txn.type === 'withdrawal') // include all statuses
      .map((txn:any) => ({
        txnId: txn._id.toString(),
        userId: String(user._id),
        userName: user.username,
        userEmail: user.email,
        amount: txn.amount,
        details: txn.details, // { cntId, account, curOut }
        status: txn.status || 'pending',
        date: txn.date,
      }))
  );

  // 3. Sort by date descending (latest first)
  withdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ success: true, withdrawals });
}
