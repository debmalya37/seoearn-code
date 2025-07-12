// src/app/api/wallet/withdraw/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'

export async function POST(req: NextRequest) {
  const { userId, amount, account, currency } = await req.json()

  // 1) Basic validation
  if (
    !userId ||
    typeof amount !== 'number' ||
    amount <= 0 ||
    !account ||
    !currency
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

  // 2) Lock funds
  wallet.balance -= amount
  wallet.locked = (wallet.locked || 0) + amount
  await wallet.save()

  // 3) Record a pending withdrawal with exactly these fields:
  const withdrawalTx = {
    type: 'withdrawal' as const,
    amount,
    status: 'pending' as const,
    date: new Date(),
    providerTxId: null as string | null,
    details: {
      account,    // payeer account
      currency    // currency code, e.g. "USD"
    },
  }
  user.transactions.push(withdrawalTx)
  await user.save()

  const txn = user.transactions.at(-1)!
  return NextResponse.json({
    success: true,
    message: 'Withdrawal requested – awaiting admin approval',
    txnId: txn._id.toString(),
  })
}
