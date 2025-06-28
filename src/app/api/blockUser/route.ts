// src/app/api/blockUser/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';

export async function PATCH(request: Request) {
  try {
    await dbConnect();

    const { userId, block } = await request.json();
    if (!userId || typeof block !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid payload' },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { isBlocked: block },
      { new: true }
    ).select('username isBlocked');

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `User ${block ? 'blocked' : 'unblocked'}`, user: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error blocking/unblocking user:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
