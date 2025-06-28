// src/app/api/wallet/withdraw/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import crypto from 'crypto';

const PAYEER_API_KEY = process.env.PAYEER_API_KEY!;

/**
 * Payeer payout IPN payload (POSTed). It includes fields like:
 *   history_id, status, sum_in, cur_in, sum_out, cur_out, cnt_id, account, comment, sign
 * 
 * Signature: sign = strtoupper( hash_hmac( 'sha256', (history_id:status:sum_in:cur_in:sum_out:cur_out:cnt_id:account:apiKey), apiKey ) )
 */
function verifyPayeerPayoutCallback(params: Record<string, string>): boolean {
  const {
    history_id,
    status,
    sum_in,
    cur_in,
    sum_out,
    cur_out,
    cnt_id,
    account,
    sign: incomingSign,
  } = params;

  const signString = [
    history_id,
    status,
    sum_in,
    cur_in,
    sum_out,
    cur_out,
    cnt_id,
    account,
    PAYEER_API_KEY
  ].join(':');

  const computed = crypto.createHmac('sha256', PAYEER_API_KEY).update(signString).digest('hex').toUpperCase();
  return computed === incomingSign.toUpperCase();
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((v, k) => (params[k] = String(v)));

  if (!verifyPayeerPayoutCallback(params)) {
    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  }

  const { history_id, status, sum_in } = params;

  // Find the user & the matching transaction by providerTxId (history_id)
  const user = await UserModel.findOne({ 'transactions.providerTxId': history_id });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
  }

  // Locate the specific withdrawal txn
  const txn = user.transactions.find((t:any) => t.providerTxId === history_id);
  if (!txn) {
    return NextResponse.json({ success: false, message: 'Transaction not found in user' }, { status: 404 });
  }

  const amount = parseFloat(sum_in);

  if (status === 'success') {
    // Mark transaction as completed
    txn.status = 'completed';
    await user.save();

    // Deduct locked funds and do not return to balance
    const wallet = await Wallet.findOne({ userId: user._id.toString() });
    if (wallet) {
      wallet.locked -= amount;
      await wallet.save();
    }
  } else {
    // Payout failed: mark txn as failed and refund user's locked funds
    txn.status = 'failed';
    await user.save();

    const wallet = await Wallet.findOne({ userId: user._id.toString() });
    if (wallet) {
      wallet.locked -= amount;
      wallet.balance += amount;
      await wallet.save();
    }
  }

  // Acknowledge
  return NextResponse.json({ success: true });
}
