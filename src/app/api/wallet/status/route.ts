import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import Wallet from '@src/models/wallet';
import crypto from 'crypto';
import { Types } from 'mongoose';
import { fetchRate } from '@src/lib/exchange'; // ✅ use your helper here

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
} = process.env;

export async function POST(req: NextRequest) {
  let body: Record<string, string> = {};
  const ct = req.headers.get('content-type') || '';
  if (ct.includes('application/json')) {
    body = await req.json();
  } else {
    const fm = await req.formData();
    for (const [k, v] of fm.entries()) {
      body[k] = String(v);
    }
  }

  const {
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc: rawDesc,
    m_status,
    m_operation_id,
    m_operation_ps = '',
    m_operation_date = '',
    m_operation_pay_date = '',
  } = body;

  if (m_shop !== PAYEER_MERCHANT_ID) {
    return new NextResponse('ERROR: invalid shop', { status: 400 });
  }

  const m_desc = decodeURIComponent(rawDesc || '');

  const signString = [
    m_operation_id,
    m_operation_ps,
    m_operation_date,
    m_operation_pay_date,
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_status,
    PAYEER_MERCHANT_SECRET!,
  ].join(':');

  const expected = crypto
    .createHash('sha256')
    .update(signString)
    .digest('hex')
    .toUpperCase();

  if (expected !== (body.m_sign || '').toUpperCase()) {
    console.error('Invalid sign. Expected:', expected, 'Got:', body.m_sign);
    return new NextResponse('ERROR: invalid sign', { status: 400 });
  }

  if (!['success', 'sandbox'].includes(m_status.toLowerCase())) {
    return new NextResponse('OK');
  }

  await dbConnect();

  let user = await UserModel.findOne({ 'transactions.orderId': m_orderid });
  if (!user) {
    try {
      const oid = new Types.ObjectId(m_orderid);
      user = await UserModel.findOne({ 'transactions._id': oid });
    } catch {}
  }
  if (!user) {
    console.error('Status callback: txn not found', m_orderid);
    return new NextResponse('ERROR: txn not found', { status: 404 });
  }

  const txn = user.transactions.find(
    (tx: any) => tx.orderId === m_orderid || tx._id.toString() === m_orderid
  )!;

  if (txn.status !== 'completed') {
    txn.status = 'completed';
    txn.providerTxId = m_operation_id;

    // ✅ Convert deposit to USD
    let amountInUSD = parseFloat(m_amount);
    if (m_curr !== 'USD') {
      try {
        const rate = await fetchRate(m_curr, 'USD');
        amountInUSD = parseFloat((amountInUSD * rate).toFixed(2));
        console.log(`Converted ${m_amount} ${m_curr} → ${amountInUSD} USD @ rate ${rate}`);
      } catch (err) {
        console.warn(`Conversion failed for ${m_curr}→USD:`, err);
        return new NextResponse('ERROR: conversion failed', { status: 500 });
      }
    }

    // Optional: update txn with conversion details
    txn.converted = {
      from: m_curr,
      originalAmount: parseFloat(m_amount),
      to: 'USD',
      usdAmount: amountInUSD,
    };

    await user.save();

    // ✅ Credit USD to wallet
    let wallet = await Wallet.findOne({ userId: user._id.toString() });
    if (!wallet) {
      wallet = await new Wallet({ userId: user._id.toString(), balance: 0 }).save();
    }
    wallet.balance += amountInUSD;
    await wallet.save();
  }

  return new NextResponse('OK');
}
