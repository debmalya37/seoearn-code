// src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  await dbConnect();

  // 1. Ensure user is authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  // 2. Fetch the user’s notifications
  const foundUser = await UserModel.findOne({ email: session.user.email }).select('notifications').exec();
  if (!foundUser) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, notifications: foundUser.notifications }, { status: 200 });
}
