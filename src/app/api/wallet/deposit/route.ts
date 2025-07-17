// src/app/api/wallet/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { buildPayeerForm } from '@src/lib/payeer‑merchant'
import { fetchRate } from '@src/lib/exchange'

export async function POST(req: NextRequest) {
  const { userId, amount, currency } = await req.json()

  // 1) Validate
  if (
    !userId ||
    typeof amount !== 'number' ||
    amount <= 0 ||
    typeof currency !== 'string' ||
    !currency
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload' },
      { status: 400 }
    )
  }

  await dbConnect()

  // 2) Find user
  const user = await UserModel.findById(userId)
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    )
  }

  // 3) Compute USD equivalent
  const rate = currency === 'USD' ? 1 : await fetchRate(currency, 'USD')
  const usdAmount = +(amount * rate).toFixed(8)

  // 4) Record pending transaction in the user sub‑doc
  const depositTxn = {
    // orderId will be set by Mongoose when we push
    type:           'deposit' as const,
    nativeAmount:   amount,
    nativeCurrency: currency,
    usdAmount,
    date:           new Date(),
    status:         'pending' as const,
    providerTxId:   null,
    details:        {}
  }
  user.transactions.push(depositTxn)
  await user.save()

  // 5) Grab our new transaction’s ID
  const lastTxn = user.transactions[user.transactions.length - 1]
  const orderId = lastTxn._id.toString()

  // 6) Ensure the wallet exists (USD‑based balance)
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0, locked: 0 })
    await wallet.save()
  }

  // 7) Build Payeer form for the *native* amount & currency
  const { url, fields } = buildPayeerForm(
    orderId,
    amount,
    currency,
    `Deposit #${orderId} in ${currency}`
  )

  // 8) Return form data to client
  return NextResponse.json({
    success: true,
    url,
    fields,
  })
}
