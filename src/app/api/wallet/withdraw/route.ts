// src/app/api/wallet/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'

export async function POST(req: NextRequest) {
  const { userId, amount, curIn, curOut, cntId, account } = await req.json()

  // 1) Validate
  if (
    !userId ||
    typeof amount !== 'number' ||
    amount <= 0 ||
    !curIn ||
    !curOut ||
    !cntId ||
    !account
  ) {
    return NextResponse.json({ success: false, message: 'Invalid request payload' }, { status: 400 })
  }

  await dbConnect()
  const user = await UserModel.findById(userId)
  const wallet = user && (await Wallet.findOne({ userId }))
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
  }
  if (!wallet || wallet.balance < amount) {
    return NextResponse.json({ success: false, message: 'Insufficient funds' }, { status: 400 })
  }

  // 2) Lock funds
  wallet.balance -= amount
  // Optionally track locked separately:
  wallet.locked = (wallet.locked || 0) + amount
  await wallet.save()

  // 3) Record a "pending" withdrawal transaction
  const withdrawalTxn = {
    type: 'withdrawal' as const,
    amount,
    status: 'pending' as const,
    date: new Date(),
    providerTxId: null as string | null,
    details: { cntId, account, curIn, curOut },
  }
  user.transactions.push(withdrawalTxn)
  await user.save()

  // Grab the new txn ID to return
  const txnId = user.transactions.at(-1)!._id.toString()

  return NextResponse.json({
    success: true,
    message: 'Withdrawal requested – awaiting admin approval',
    txnId,
  })
}
