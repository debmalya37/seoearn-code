// src/app/api/wallet/confirm-account/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

export async function POST(req: NextRequest) {
  const { userId, accountId, code } = await req.json();
  if (!userId || !accountId || !code) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  }

  await dbConnect();
  const user = await UserModel.findById(userId);
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

  const acc = user.bankAccounts.id(accountId);
  if (!acc) return NextResponse.json({ success: false, message: 'Account not found' }, { status: 404 });
  if (acc.verified) return NextResponse.json({ success: false, message: 'Already verified' }, { status: 400 });

  if (acc.verificationCode !== code) {
    return NextResponse.json({ success: false, message: 'Incorrect code' }, { status: 400 });
  }

  // mark verified
  acc.verified = true;
  acc.verificationCode = undefined;
  await user.save();

  return NextResponse.json({ success: true });
}
