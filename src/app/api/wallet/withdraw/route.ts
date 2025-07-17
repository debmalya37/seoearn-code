import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import Wallet from '@src/models/wallet'
import { fetchRate } from '@src/lib/exchange'

export async function POST(req: NextRequest) {
  const {
    userId,
    usdAmount,
    nativeCurrency,
    account
  } = await req.json()

  if (
    !userId ||
    typeof usdAmount !== 'number' ||
    usdAmount <= 0 ||
    typeof nativeCurrency !== 'string' ||
    !nativeCurrency ||
    typeof account !== 'string' ||
    !account
  ) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload' },
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
  if (!wallet) {
    return NextResponse.json(
      { success: false, message: 'Wallet not found' },
      { status: 400 }
    )
  }

  const rate = nativeCurrency === 'USD'
    ? 1
    : await fetchRate('USD', nativeCurrency)
  const nativeAmount = +(usdAmount * rate).toFixed(8)

  if (wallet.balance < usdAmount) {
    return NextResponse.json(
      { success: false, message: 'Insufficient USD balance' },
      { status: 400 }
    )
  }

  // Lock the amount and deduct from balance
  wallet.balance -= usdAmount
  wallet.locked  = (wallet.locked || 0) + usdAmount
  await wallet.save()

  const isManual = ['LTC', 'MATIC'].includes(nativeCurrency.toUpperCase());

user.transactions.push({
  type:           'withdrawal',
  nativeAmount,
  nativeCurrency,
  usdAmount,
  date:           new Date(),
  status:         'processing',
  providerTxId:   null,
  method:         isManual ? 'manual' : 'payeer',
  details:        { account }
});

  
  await user.save()

  const txnId = user.transactions.at(-1)!._id.toString()

  return NextResponse.json({
    success: true,
    message: 'Withdrawal request sent for admin approval',
    txnId
  })
}
