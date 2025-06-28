// src/app/api/wallet/deposit/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { verifyPayeerPaymentCallback } from '@src/lib/payeer';

export async function POST(req: NextRequest) {
  await dbConnect();

  // Payeer sends form-urlencoded fields. Access via `await req.formData()`
  const form = await req.formData();
  const params: Record<string, string> = {};
  form.forEach((value, key) => {
    params[key] = String(value);
  });

  // Validate signature and status
  if (!verifyPayeerPaymentCallback(params)) {
    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  }

  const { m_status, m_orderid, m_amount } = params;
  // m_status = “success” when payment succeeded
  if (m_status !== 'success') {
    // Mark that deposit as failed
    await UserModel.updateOne(
      { 'transactions._id': m_orderid },
      { 'transactions.$.status': 'failed' }
    );
    return NextResponse.json({ success: false, message: 'Payment failed' });
  }

  // Locate that user-transaction by orderId
  const orderId = m_orderid;
  const amount = parseFloat(m_amount);

  const user = await UserModel.findOne({ 'transactions._id': orderId });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }

  // 1) Mark the deposit txn as “completed” and set providerTxId
  const txn = user.transactions.id(orderId);
  if (!txn) {
    return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
  }
  txn.status = 'completed';
  txn.providerTxId = params['m_shop'] + ':' + params['m_orderid']; // or any unique string
  await user.save();

  // 2) Credit the wallet
  let wallet = await Wallet.findOne({ userId: user._id.toString() });
  if (!wallet) {
    wallet = new Wallet({ userId: user._id.toString(), balance: 0, locked: 0 });
  }
  wallet.balance += amount;
  await wallet.save();

  // 3) (Optional) You can send back a simple “OK” or render a hidden page.
  return NextResponse.json({ success: true, message: 'Deposit completed' });
}
