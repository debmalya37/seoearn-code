// src/app/api/wallet/status/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { verifyCallback } from '@src/lib/payeer'

export async function POST(req: NextRequest) {
  const body = Object.fromEntries(await req.formData()) as Record<string, string>

  const isValid = verifyCallback(body as any)
  if (!isValid) {
    console.warn('❌ Invalid IPN from Payeer:', body)
    return new Response('Invalid signature', { status: 400 })
  }

  const orderId = body['m_orderid']
  const status = body['m_status']
  const amount = parseFloat(body['m_amount'])

  await dbConnect()
  const user = await UserModel.findOne({ 'transactions._id': orderId })
  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  const txn = user.transactions.find((tx : any) => tx._id.toString() === orderId)
  if (!txn) {
    return new Response('Transaction not found', { status: 404 })
  }

  // Update transaction
  txn.status = status === 'success' ? 'completed' : 'failed'
  txn.providerTxId = body['m_operation_id']
  await user.save()

  // Update wallet
  if (status === 'success') {
    const wallet = await Wallet.findOne({ userId: user._id })
    if (wallet) {
      wallet.balance += amount
      await wallet.save()
    }
  }

  return new Response('OK', { status: 200 })
}
