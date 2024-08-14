import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, 'username email gender age isVerified').exec();
    
    return NextResponse.json({ users }); // Ensure the 'users' key is present in the response
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch users', users: [] }, { status: 500 });
  }
}
