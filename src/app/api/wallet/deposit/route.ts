// src/app/api/wallet/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { buildPayeerForm } from '@src/lib/payeer‑merchant'

export async function POST(req: NextRequest) {
  const { userId, amount, currency } = await req.json()

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
  const user = await UserModel.findById(userId)
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    )
  }

  // 1. Record a pending deposit transaction
  const depositTxn = {
    type: 'deposit' as const,
    amount,
    status: 'pending' as const,
    date: new Date(),
    providerTxId: null,
    details: {},
  }
  user.transactions.push(depositTxn)
  await user.save()

  // 2. Ensure the wallet exists
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 })
    await wallet.save()
  }

  // 3. Build the Payeer form parameters
  const orderId = user.transactions[user.transactions.length - 1]._id.toString()
  const { url, fields } = buildPayeerForm(
    orderId,
    amount,
    currency,
    `Deposit #${orderId} to wallet`
  )

  // 4. Return them to the client
  return NextResponse.json({
    success: true,
    url,
    fields,
  })
}
