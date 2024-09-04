import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import { getServerSession } from 'next-auth/next';
import mongoose from 'mongoose';
import authOptions from '../../auth/[...nextauth]/options';

// The function that handles GET requests
export async function GET(req: NextRequest) {
  try {
    await dbConnect
    
    // Getting session using NextAuth with NextRequest
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user || !session.user.email) {
      return NextResponse.json({ success: false, message: 'User not authenticated' }, { status: 401 });
    }

    const userId = session.user.id; // Assuming session.user contains an id field

    // Aggregating the total earnings from completed tasks
    const completedTasks = await Task.aggregate([
      { $match: { doneBy: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: null, totalEarnings: { $sum: '$reward' } } },
    ]);

    const totalEarnings = completedTasks[0]?.totalEarnings || 0;

    return NextResponse.json({ success: true, earnings: totalEarnings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
