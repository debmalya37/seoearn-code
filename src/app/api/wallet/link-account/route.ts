// src/app/api/wallet/link-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import crypto from 'crypto';
import { sendEmail } from '@src/lib/mailer';  // implement your mailer

export async function POST(req: NextRequest) {
  const { userId, bankName, accountHolderName, accountNumber, ifsc, routingNumber } = await req.json();
  if (!userId || !bankName || !accountHolderName || !accountNumber) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  }

  await dbConnect();
  const user = await UserModel.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

  // generate 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();
  const acc = {
    bankName,
    accountHolderName,
    accountNumber,
    ifsc: ifsc || undefined,
    routingNumber: routingNumber || undefined,
    verified: false,
    verificationCode: code,
    createdAt: new Date(),
  };
  user.bankAccounts.push(acc as any);
  await user.save();

  // send email to user with code
  await sendEmail(user.email, 'Verify your bank account', `Your code: ${code}`);

  return NextResponse.json({ success: true, account: user.bankAccounts.at(-1) });
}
