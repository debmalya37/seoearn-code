// src/app/api/admin/withdrawals/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { createPayout } from '@src/lib/payeer‑merchant'; // your createPayout helper

// GET /api/admin/withdrawals
export async function GET(_: NextRequest) {
  await dbConnect();
  // Lookup all users whose transactions have a pending withdrawal
  const users = await UserModel.find({ 'transactions.status': 'pending' }).lean();
  // Flatten into one list
  const withdrawals = users.flatMap(u =>
    u.transactions
      .filter((txn:any) => txn.type === 'withdrawal' && txn.status === 'pending')
      .map((txn : any) => ({
        txnId: txn._id.toString(),
        userId: String(u._id).toString(),
        userName: u.username,
        userEmail: u.email,
        amount: txn.amount,
        details: txn.details,      // { cntId, account, curOut }
        date: txn.date,
      }))
  );
  return NextResponse.json({ success: true, withdrawals });
}
