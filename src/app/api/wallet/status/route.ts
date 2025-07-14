// src/app/api/wallet/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import crypto from 'crypto'
import { Types } from 'mongoose'

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
} = process.env

export async function POST(req: NextRequest) {
  // 1️⃣ Gather params
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

  // 2️⃣ Destructure parameters
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
    m_operation_pay_date = ''
  } = body

  // 3️⃣ Validate shop ID
  if (m_shop !== PAYEER_MERCHANT_ID) {
    return new NextResponse('ERROR: invalid shop', { status: 400 })
  }

  // 4️⃣ URL‑decode description
  const m_desc = decodeURIComponent(rawDesc || '')

  // 5️⃣ Recompute Payeer signature (note the inclusion of pay_date)
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
    PAYEER_MERCHANT_SECRET!
  ].join(':')

  const expected = crypto
    .createHash('sha256')
    .update(signString)
    .digest('hex')
    .toUpperCase()

  if (expected !== (body.m_sign || '').toUpperCase()) {
    console.error('Invalid sign. Expected:', expected, 'Got:', body.m_sign)
    return new NextResponse('ERROR: invalid sign', { status: 400 })
  }

  // 6️⃣ Only proceed on success (or sandbox)
  if (!['success','sandbox'].includes(m_status.toLowerCase())) {
    return new NextResponse('OK')
  }

  // 7️⃣ Connect to DB
  await dbConnect()

  // 8️⃣ Lookup the user+transaction
  // First try a custom `orderId` field, then fallback to the sub‑document _id
  let user = await UserModel.findOne({ 'transactions.orderId': m_orderid })
  if (!user) {
    try {
      const oid = new Types.ObjectId(m_orderid)
      user = await UserModel.findOne({ 'transactions._id': oid })
    } catch {
      // invalid ObjectId format
    }
  }
  if (!user) {
    console.error('Status callback: txn not found', m_orderid)
    return new NextResponse('ERROR: txn not found', { status: 404 })
  }

  // 9️⃣ Mark that transaction complete if not already
  const txn = user.transactions.find((tx:any) =>
    // match either custom field or sub‑doc ID
    tx.orderId === m_orderid ||
    tx._id.toString() === m_orderid
  )!
  if (txn.status !== 'completed') {
    txn.status       = 'completed'
    txn.providerTxId = m_operation_id
    await user.save()

    // 10️⃣ Credit wallet
    let wallet = await Wallet.findOne({ userId: user._id.toString() })
    if (!wallet) {
      wallet = await new Wallet({ userId: user._id.toString(), balance: 0 }).save()
    }
    wallet.balance += parseFloat(m_amount)
    await wallet.save()
  }

  return new NextResponse('OK')
}
