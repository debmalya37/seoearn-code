import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/userModel'; // adjust the path according to your project structure
import connectDB from '@/lib/dbConnect'; // make sure you have a function to connect to your database

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const userId = req.headers.get('authorization'); // You might extract user ID from token or session
    const user = await UserModel.findById(userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
