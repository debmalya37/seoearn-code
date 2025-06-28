// src/app/api/wallet/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { createPayout } from '@src/lib/payeer'    // ← import the payout helper you actually export

export async function POST(req: NextRequest) {
  const { userId, amount, currency, cntId, account, curOut } = await req.json()

  if (
    !userId ||
    typeof amount !== 'number' ||
    amount <= 0 ||
    !currency ||
    !cntId ||
    !account ||
    !curOut
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid request payload' },
      { status: 400 }
    )
  }

  await dbConnect()
  const user = await UserModel.findById(userId)
  const wallet = user && (await Wallet.findOne({ userId }))
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    )
  }
  if (!wallet || wallet.balance < amount) {
    return NextResponse.json(
      { success: false, message: 'Insufficient funds' },
      { status: 400 }
    )
  }

  // 1) lock funds
  wallet.balance -= amount
  await wallet.save()

  // 2) record a processing withdrawal transaction
  const withdrawalTxn = {
    type: 'withdrawal' as const,
    amount,
    status: 'processing' as const,
    date: new Date(),
    providerTxId: null as string | null,
    details: { cntId, account, curOut },
  }
  user.transactions.push(withdrawalTxn)
  await user.save()

  // 3) call Payeer’s payouts API
  const payout = await createPayout({
    orderId:    user.transactions.at(-1)!._id.toString(),
    amount,
    curIn:      currency,
    curOut,
    cntId,
    account,
    comment:    `Withdrawal #${user.transactions.at(-1)!._id}`,
  })

  // 4) on failure, roll back
  if (!payout.success) {
    wallet.balance += amount
    await wallet.save()

    const lastTxn = user.transactions.at(-1)!
    lastTxn.status = 'failed'
    await user.save()

    return NextResponse.json(
      { success: false, message: payout.error },
      { status: 500 }
    )
  }

  // 5) on success, record Payeer’s history ID
  const lastTxn = user.transactions.at(-1)!
  lastTxn.providerTxId = payout.data.historyId || payout.data.history_id || null
  await user.save()

  return NextResponse.json({
    success: true,
    message: 'Withdrawal initiated',
    providerTxId: lastTxn.providerTxId,
  })
}
