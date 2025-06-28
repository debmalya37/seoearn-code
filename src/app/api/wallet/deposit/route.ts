// src/app/api/wallet/deposit/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { createDepositUrl } from '@src/lib/payeer'

export async function POST(req: NextRequest) {
  const { userId, amount, currency } = await req.json()
  if (!userId || typeof amount !== 'number' || amount <= 0 || !currency) {
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

  // 1. Record a pending deposit transaction in the user's history
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

  // 2. Ensure the user has a wallet document
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = new Wallet({ userId, balance: 0 })
    await wallet.save()
  }

  // 3. Generate the Payeer payment URL
  const orderId = user.transactions[user.transactions.length - 1]._id.toString()
  const paymentUrl = createDepositUrl({
    orderId,
    amount,
    currency,
    description: `Deposit #${orderId} to wallet`,
  })

  // Return the URL so the client can redirect the user to Payeer
  return NextResponse.json({ success: true, paymentUrl })
}
