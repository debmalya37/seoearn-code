// src/app/api/wallet/deposit/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import crypto from 'crypto'

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
} = process.env

export async function POST(req: NextRequest) {
  // 1️⃣ Gather params from either JSON or formData
  let body: Record<string,string> = {}
  const ct = req.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    body = await req.json()
  } else {
    const fm = await req.formData()
    for (const [k,v] of fm.entries()) {
      body[k] = String(v)
    }
  }

  const {
    m_shop, m_orderid, m_amount, m_curr,
    m_desc, m_status, m_operation_id, m_operation_ps='', m_operation_date=''
  } = body

  // 2️⃣ Validate shop
  if (m_shop !== PAYEER_MERCHANT_ID) {
    return new NextResponse('ERROR: invalid shop', { status: 400 })
  }

  // 3️⃣ Recompute signature exactly as Payeer expects
  const signString = [
    m_operation_id,
    m_operation_ps,
    m_operation_date,
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_status,
    PAYEER_MERCHANT_SECRET!
  ].join(':')

  const expected = crypto
    .createHash('sha256')
    .update(signString)
    .digest('hex')
    .toUpperCase()

  if (expected !== (body.m_sign||'')) {
    return new NextResponse('ERROR: invalid sign', { status: 400 })
  }

  // 4️⃣ Only “success” or “sandbox”
  if (!['success','sandbox'].includes(m_status.toLowerCase())) {
    return new NextResponse('OK')
  }

  // 5️⃣ Now credit the user
  await dbConnect()
  const user = await UserModel.findOne({ 'transactions._id': m_orderid })
  if (!user) {
    console.error('Status callback: txn not found', m_orderid)
    return new NextResponse('ERROR: txn not found', { status: 404 })
  }
  const txn = user.transactions.id(m_orderid)!
  if (txn.status !== 'completed') {
    txn.status       = 'completed'
    txn.providerTxId = m_operation_id
    await user.save()

    let wallet = await Wallet.findOne({ userId: user._id.toString() })
    if (!wallet) wallet = await new Wallet({ userId: user._id.toString(), balance: 0 }).save()
    wallet.balance += parseFloat(m_amount)
    await wallet.save()
  }

  return new NextResponse('OK')
}
