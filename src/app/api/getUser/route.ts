import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  await dbConnect();

  // Extract query parameters from the URL
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const userId = searchParams.get('id');

  try {
    const users = await UserModel.find({});

    // If you want to filter by email or userId, uncomment and modify the following lines:
    // const users = email ? await UserModel.findOne({ email }) : await UserModel.find({});
    // const users = userId ? await UserModel.findById(userId) : await UserModel.find({});

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
