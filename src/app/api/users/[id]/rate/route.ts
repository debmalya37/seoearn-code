// src/app/api/users/[id]/rate/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { Types } from 'mongoose';
import { getServerSession } from 'next-auth';
import authOptions from '@src/app/api/auth/[...nextauth]/options';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  const { rating } = await request.json() as { rating: number };
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ success: false, message: 'Rating must be 1–5' }, { status: 400 });
  }

  const user = await UserModel.findById(id);
  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
  }

  user.ratings.push(rating);
  await user.save();

  // compute new average & count
  const count = user.ratings.length;
  const avg   = (user.ratings.reduce((sum:any, r:any) => sum + r, 0) / count).toFixed(1);

  return NextResponse.json({
    success: true,
    message: 'Rating saved',
    rating: { average: parseFloat(avg), count }
  });
}
