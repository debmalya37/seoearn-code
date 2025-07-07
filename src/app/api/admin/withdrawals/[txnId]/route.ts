// src/app/api/admin/withdrawals/[txnId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { massPayout } from '@src/lib/payeer-mass' // ✅ use massPayout instead
import { Types } from 'mongoose'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { txnId: string } }
) {
  await dbConnect()
  const { txnId } = params
  const { action } = await req.json() // "approve" or "reject"

  if (
    !Types.ObjectId.isValid(txnId) ||
    !['approve', 'reject'].includes(action)
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid request' },
      { status: 400 }
    )
  }

  // 1️⃣ Find user + specific transaction
  const user = await UserModel.findOne({ 'transactions._id': txnId })
  if (!user) {
    return NextResponse.json(
      { success: false, message: 'Transaction not found' },
      { status: 404 }
    )
  }

  const txn = user.transactions.id(txnId)!
  if (!txn) {
    return NextResponse.json(
      { success: false, message: 'Transaction not found in user' },
      { status: 404 }
    )
  }

  if (txn.status === 'completed') {
    return NextResponse.json(
      { success: false, message: 'Transaction already processed' },
      { status: 400 }
    )
  }

  if (action === 'reject') {
    // 2️⃣ Roll back locked funds
    const wallet = await Wallet.findOne({ userId: user._id.toString() })
    if (wallet) {
      wallet.balance += txn.amount
      await wallet.save()
    }
    txn.status = 'failed'
    await user.save()
    return NextResponse.json(
      { success: true, message: 'Withdrawal rejected' }
    )
  }

  // 3️⃣ Approve → perform the payout
  const { cntId, account, curOut, curIn } = txn.details || {}

  if (!account || !curIn || !curOut) {
    return NextResponse.json(
      { success: false, message: 'Missing payout details in transaction' },
      { status: 400 }
    )
  }

  try {
    const payoutList = [{
      to: account,
      sumIn: txn.amount.toFixed(2),
      curIn,
      curOut,
      comment: `Admin withdrawal #${txnId}`,
      referenceId: txnId,
    }]

    const historyList = await massPayout(payoutList)
    const result = historyList.find(h => h.referenceId === txnId)

    if (!result) {
      return NextResponse.json(
        { success: false, message: 'Payeer did not return history for this transaction' },
        { status: 500 }
      )
    }

    txn.status = 'completed'
    txn.providerTxId = result.historyId
    await user.save()

    return NextResponse.json(
      { success: true, message: 'Withdrawal approved' }
    )
  } catch (err: any) {
    console.error('Payeer mass payout error:', err)
    return NextResponse.json(
      { success: false, message: err.message || 'Mass payout failed' },
      { status: 500 }
    )
  }
}
