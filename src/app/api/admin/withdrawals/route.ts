// src/app/api/admin/withdrawals/route.ts

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

export async function GET(_: NextRequest) {
  await dbConnect();

  const users = await UserModel.find({ 'transactions.type': 'withdrawal' }).lean();

  const withdrawals = users.flatMap(user =>
    (user.transactions || [])
      .filter((txn: any) => txn.type === 'withdrawal')
      .map((txn: any) => ({
        txnId:          txn._id.toString(),
        userId:         String(user._id),
        userName:       user.username,
        userEmail:      user.email,
        method:         txn.method || 'automatic', // 'manual' or 'automatic'
        nativeAmount:   txn.nativeAmount,
        nativeCurrency: txn.nativeCurrency,
        usdAmount:      txn.usdAmount,
        account:        txn.details?.account || 'N/A',
        status:         txn.status,
        date:           txn.date,
      }))
  );

  withdrawals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return NextResponse.json({ success: true, withdrawals });
}
