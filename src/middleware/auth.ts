import { NextRequest, NextResponse } from 'next/server';
import  jwt  from 'jsonwebtoken';
import UserModel from '@/models/userModel';
import connectDB from '@/lib/dbConnect';

export async function middleware(req: NextRequest) {
  await connectDB();

  const token = req.headers.get('authorization');

  if (!token) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    req.user = user;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}
