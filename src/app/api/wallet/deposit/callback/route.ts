// src/app/api/wallet/deposit/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import { verifyCallback } from '@src/lib/payeer';

export async function POST(req: NextRequest) {
  await dbConnect();

  // Parse form data
  const form = await req.formData();
  const paramsMap = new Map<string,string>();
  form.forEach((value, key) => {
    paramsMap.set(key, String(value));
  });

  // Build the strongly‑typed object for verifyCallback
  const callbackParams = {
    m_operation_id:    paramsMap.get('m_operation_id')    || '',
    m_operation_ps:    paramsMap.get('m_operation_ps')    || '',
    m_operation_date:  paramsMap.get('m_operation_date')  || '',
    m_operation_pay_date: paramsMap.get('m_operation_pay_date') || '',
    m_shop:            paramsMap.get('m_shop')            || '',
    m_orderid:         paramsMap.get('m_orderid')         || '',
    m_amount:          paramsMap.get('m_amount')          || '',
    m_curr:            paramsMap.get('m_curr')            || '',
    m_desc:            paramsMap.get('m_desc')            || '',
    m_status:          paramsMap.get('m_status')          || '',
    m_sign:            paramsMap.get('m_sign')            || '',
  };

  // 1) verify signature
  if (!verifyCallback(callbackParams)) {
    return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
  }

  const { m_status, m_orderid, m_amount } = callbackParams;

  // 2) failed payments
  if (m_status !== 'success') {
    await UserModel.updateOne(
      { 'transactions._id': m_orderid },
      { 'transactions.$.status': 'failed' }
    );
    return NextResponse.json({ success: false, message: 'Payment failed' });
  }

  // 3) find the user and transaction
  const orderId = m_orderid;
  const amount = parseFloat(m_amount);
  const user = await UserModel.findOne({ 'transactions._id': orderId });
  if (!user) {
    return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
  }
  const txn = user.transactions.id(orderId);
  if (!txn) {
    return NextResponse.json({ success: false, message: 'Transaction not found' }, { status: 404 });
  }

  // 4) mark transaction completed
  txn.status = 'completed';
  txn.providerTxId = `${callbackParams.m_shop}:${callbackParams.m_orderid}`;
  await user.save();

  // 5) credit user’s wallet
  let wallet = await Wallet.findOne({ userId: user._id.toString() });
  if (!wallet) {
    wallet = new Wallet({ userId: user._id.toString(), balance: 0, locked: 0 });
  }
  wallet.balance += amount;
  await wallet.save();

  return NextResponse.json({ success: true, message: 'Deposit completed' });
}
