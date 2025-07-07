// src/app/api/admin/withdrawals/payout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { massPayout } from '@src/lib/payeer-mass';

export async function POST(req: NextRequest) {
  const { txnIds }: { txnIds: string[] } = await req.json();
  if (!Array.isArray(txnIds) || txnIds.length === 0) {
    return NextResponse.json({ success: false, message: 'No transactions provided' }, { status: 400 });
  }

  await dbConnect();

  // 1) Collect each withdrawal, ensure it's still pending
  const payouts = [];
  for (const txnId of txnIds) {
    const user = await UserModel.findOne({ 'transactions._id': txnId });
    if (!user) continue;
    const txn = user.transactions.id(txnId)!;
    if (txn.status !== 'pending') continue;
    const wallet = await Wallet.findOne({ userId: user._id.toString() });
    // lock funds
    wallet!.balance -= txn.amount;
    wallet!.locked  = (wallet!.locked||0) + txn.amount;
    await wallet!.save();
    // mark as processing
    txn.status = 'processing';
    await user.save();

    payouts.push({
      to:            txn.details.account,
      sumIn:         txn.amount.toFixed(2),
      curIn:         txn.details.curIn,
      curOut:        txn.details.curOut,
      comment:       `Withdrawal ${txnId}`,
      referenceId:   txnId
    });
  }

  if (payouts.length === 0) {
    return NextResponse.json({ success: false, message: 'No valid pending withdrawals' });
  }

  // 2) Send mass payout
  try {
    const historyList = await massPayout(payouts);

    // 3) Record history IDs & finalize
    for (const { referenceId, historyId } of historyList) {
      const user = await UserModel.findOne({ 'transactions._id': referenceId })!;
      const txn  = user.transactions.id(referenceId)!;
      txn.providerTxId = historyId;
      txn.status       = 'completed';
      await user.save();
      // release locked
      const wallet = await Wallet.findOne({ userId: user._id.toString() })!;
      wallet.locked = (wallet.locked||0) - txn.amount;
      await wallet.save();
    }

    return NextResponse.json({ success: true, message: 'Mass payout initiated', paid: historyList.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
