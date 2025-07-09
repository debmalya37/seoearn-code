// src/app/api/wallet/deposit/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import crypto from 'crypto'

const {
  PAYEER_MERCHANT_ID,
  PAYEER_MERCHANT_SECRET,
} = process.env!

export async function POST(req: NextRequest) {
  const form = await req.formData()
  // Payeer posts fields like m_operation_id, m_sign, m_shop, m_orderid, m_amount, m_curr, m_desc, m_status
  const m_shop        = form.get('m_shop')?.toString()        || ''
  const m_orderid     = form.get('m_orderid')?.toString()     || ''
  const m_amount      = form.get('m_amount')?.toString()      || ''
  const m_curr        = form.get('m_curr')?.toString()        || ''
  const m_desc        = form.get('m_desc')?.toString()        || ''
  const m_status      = form.get('m_status')?.toString()      || ''
  const m_operationId = form.get('m_operation_id')?.toString()|| ''
  const m_sign        = form.get('m_sign')?.toString()        || ''

  // 1) Validate merchant ID
  if (m_shop !== PAYEER_MERCHANT_ID) {
    return new NextResponse('ERROR: invalid shop', { status: 400 })
  }

  // 2) Recompute signature
  // Per Payeer docs: sha256( operation_id:operation_ps:operation_date:shop:orderid:amount:curr:desc:status:secret )
  // They may omit operation_ps/date if not used; adjust to exactly match fields Payeer sends.
  // Here we assume PS & date are empty or unused; if they send them, include accordingly.
  const signString = [
    form.get('m_operation_id')?.toString() || '',
    form.get('m_operation_ps')?.toString()      || '',
    form.get('m_operation_date')?.toString()    || '',
    m_shop,
    m_orderid,
    m_amount,
    m_curr,
    m_desc,
    m_status,
    PAYEER_MERCHANT_SECRET!,
  ].join(':')

  const expectedSign = crypto
    .createHash('sha256')
    .update(signString)
    .digest('hex')
    .toUpperCase()

  if (expectedSign !== m_sign) {
    return new NextResponse('ERROR: invalid sign', { status: 400 })
  }

  // 3) Only process “success” statuses
  if (!['success', 'sandbox'].includes(m_status.toLowerCase())) {
    // you can return “OK” so Payeer won’t re-try
    return new NextResponse('OK')
  }

  // 4) Credit the user’s wallet:
  await dbConnect()
  // Find the user who has the pending deposit txn with _id = m_orderid
  const user = await UserModel.findOne({ 'transactions._id': m_orderid })
  if (!user) {
    console.error('Payeer callback: user/txn not found', m_orderid)
    return new NextResponse('ERROR: txn not found', { status: 404 })
  }

  const txn = user.transactions.id(m_orderid)!
  // Only once
  if (txn.status !== 'completed') {
    // mark txn completed
    txn.status        = 'completed'
    txn.providerTxId  = m_operationId
    await user.save()

    // update wallet
    let wallet = await Wallet.findOne({ userId: user._id.toString() })
    if (!wallet) {
      wallet = new Wallet({ userId: user._id.toString(), balance: 0 })
    }
    wallet.balance += parseFloat(m_amount)
    await wallet.save()
  }

  // tell Payeer we got it
  return new NextResponse('OK')
}
