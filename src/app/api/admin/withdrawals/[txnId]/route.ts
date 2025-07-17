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

  if (!Types.ObjectId.isValid(txnId) || !['approve', 'reject'].includes(action)) {
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }

  const user = await UserModel.findOne({ 'transactions._id': txnId });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
  }

  const txn = user.transactions.id(txnId)!;
  if (txn.status === 'completed') {
    return NextResponse.json({ success: false, message: 'Already processed' }, { status: 400 });
  }

  const wallet = await Wallet.findOne({ userId: user._id });
  if (!wallet) {
    return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
  }

  if (action === 'reject') {
    wallet.balance += txn.usdAmount;
    await wallet.save();
    txn.status = 'failed';
    await user.save();
    return NextResponse.json({ success: true, message: 'Withdrawal rejected' });
  }

  // Approve
  const { account } = txn.details || {};
  const currency = txn.nativeCurrency;
  const nativeAmount = txn.nativeAmount.toString();
  const isManual = txn.method === 'manual';

  if (!account || !currency) {
    return NextResponse.json({ success: false, message: 'Missing payout details' }, { status: 400 });
  }

  // APPROVE LOGIC
try {
  // Lock funds
  wallet.balance -= txn.usdAmount;
  wallet.locked = (wallet.locked || 0) + txn.usdAmount;
  await wallet.save();

  // Bypass Payeer payout for manual currencies
  const manualCurrencies = ['LTC', 'MATIC', 'POLYGON']; // Add more if needed

  if (manualCurrencies.includes(currency.toUpperCase())) {
    txn.status = 'completed';
    txn.providerTxId = 'manual'; // Optional: mark as manually processed
    await user.save();

    wallet.locked -= txn.usdAmount;
    await wallet.save();

    return NextResponse.json({ success: true, message: 'Manual withdrawal approved' });
  }

  // Call payeer singlePayout for automatic currencies
  const historyId = await singlePayout(account, nativeAmount, currency, txnId);

  txn.status = 'completed';
  txn.providerTxId = historyId;
  await user.save();

  wallet.locked -= txn.usdAmount;
  await wallet.save();

  return NextResponse.json({ success: true, message: 'Withdrawal approved' });

} catch (err: any) {
  console.error('Payeer payout error:', err.message);

  wallet.balance += txn.usdAmount;
  wallet.locked -= txn.usdAmount;
  await wallet.save();

  return NextResponse.json(
    { success: false, message: err.message || 'Payout failed' },
    { status: 500 }
  );
}

}
