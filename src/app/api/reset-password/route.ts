// src/app/api/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@src/lib/dbConnect'
import UserModel from '@src/models/userModel'
import { compare, hash } from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, otp, newPassword } = await req.json() as {
    email: string
    otp: string
    newPassword: string
  }

  if (!email || !otp || !newPassword) {
    return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
  }

  await dbConnect()
  const user = await UserModel.findOne({ email })
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
  }

  // check OTP
//   if (!user.resetOTP || !user.resetOTPExpires) {
//     return NextResponse.json({ success: false, error: 'No OTP in progress' }, { status: 400 })
//   }
//   if (user.resetOTP !== otp || user.resetOTPExpires < new Date()) {
//     return NextResponse.json({ success: false, error: 'Invalid or expired OTP' }, { status: 400 })
//   }

  // everything ok → update password
  const hashed = await hash(newPassword, 10)
  user.password = hashed
  // clear OTP fields
  user.resetOTP = null
  user.resetOTPExpires = null
  await user.save()

  return NextResponse.json({ success: true })
}
