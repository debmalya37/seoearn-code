import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/userModel';

export async function DELETE(request: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {});

    const { userId } = await request.json();

    await User.findByIdAndDelete(userId);

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
