import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';

export async function GET() {
  try {
    await dbConnect(); // Ensure you're connecting to the correct database
    const users = await User.find({}, 'username email gender age isVerified').exec();

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', users: [] }, { status: 500 });
  }
}
