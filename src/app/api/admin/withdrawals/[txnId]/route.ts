// src/app/api/admin/withdrawals/[txnId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { singlePayout } from '@src/lib/payeer-single';
import { Types } from 'mongoose';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { txnId: string } }
) {
  await dbConnect();
  const { txnId } = params;
  const { action } = await req.json();

  // 1) Validate
  if (!Types.ObjectId.isValid(txnId) || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  // 2) Find user & transaction
  const user = await UserModel.findOne({ 'transactions._id': txnId });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
  }
  const txn = user.transactions.id(txnId)!;
  if (txn.status === 'completed') {
    return NextResponse.json({ success: false, message: 'Already processed' }, { status: 400 });
  }

  // 3) Reject flow
  if (action === 'reject') {
    const wallet = await Wallet.findOne({ userId: user._id.toString() });
    if (wallet) {
      wallet.balance += txn.amount;
      await wallet.save();
    }
    txn.status = 'failed';
    await user.save();
    return NextResponse.json({ success: true, message: 'Withdrawal rejected' });
  }

  // 4) Approve → Use Payeer single payout
  const { account, currency } = txn.details || {};
  if (!account || !currency) {
    return NextResponse.json(
      { success: false, message: 'Missing payout details in transaction' },
      { status: 400 }
    );
  }

  try {
    const providerTxId = await singlePayout(account, txn.amount.toFixed(2), currency, txnId);

    txn.status = 'completed';
    txn.providerTxId = providerTxId;
    await user.save();

    return NextResponse.json({ success: true, message: 'Withdrawal approved' });
  } catch (err: any) {
    console.error('Payeer payout error:', err);
    return NextResponse.json(
      { success: false, message: err.message || 'Payout failed' },
      { status: 500 }
    );
  }
}
