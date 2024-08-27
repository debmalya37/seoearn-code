// src/app/api/users/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';

export async function GET() {
  try {
    await dbConnect(); // Ensure you're connecting to the correct database
    const users = await User.find({}, 'username email gender age isVerified').exec();

    // Set cache control headers to prevent caching
    const response = NextResponse.json({ userList: users });
    response.headers.set('Cache-Control', 'no-store');

    return response;
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', userList: [] }, { status: 500 });
  }
}
