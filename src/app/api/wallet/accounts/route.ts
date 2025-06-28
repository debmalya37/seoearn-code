// src/app/api/wallet/accounts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel, { IBankAccount } from '@src/models/userModel';

export async function GET(req: NextRequest) {
  await dbConnect();

  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) {
    return NextResponse.json(
      { success: false, message: 'userId required' },
      { status: 400 }
    );
  }

  // Tell TS exactly what shape .lean() returns:
  const user = await UserModel
    .findById(userId)
    .select('bankAccounts')
    .lean<{ bankAccounts: IBankAccount[] }>();

  if (!user) {
    return NextResponse.json(
      { success: false, message: 'User not found' },
      { status: 404 }
    );
  }

  // bankAccounts is now properly typed
  return NextResponse.json(
    { success: true, accounts: user.bankAccounts || [] },
    { status: 200 }
  );
}
