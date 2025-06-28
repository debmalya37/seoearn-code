// src/app/api/wallet/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';

export async function GET(req: NextRequest) {
  await dbConnect();
  // retrieve current userId from session or query
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ success: false, message: 'userId required' }, { status: 400 });

  const user = await UserModel.findById(userId).select('bankAccounts').lean();
  if (!user) return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });

  return NextResponse.json({ success: true, accounts: user.bankAccounts });
}
