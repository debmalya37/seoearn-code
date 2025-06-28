// src/app/api/tasks/[id]/requests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import UserModel from '@src/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';
import { Types } from 'mongoose';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
  
    const { id } = params;
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid task ID' }, { status: 400 });
    }
  
    const { message, fileUrl } = await req.json();
    if (!message && !fileUrl) {
      return NextResponse.json({ success: false, message: 'No submission data' }, { status: 400 });
    }
  
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }
  
    const updated = await Task.findByIdAndUpdate(
      id,
      {
        $push: {
          requests: {
            userId: user._id,
            message,
            fileUrl,
            status: 'Pending',
            createdAt: new Date(),
          }
        }
      },
      { new: true }
    )
    .populate('requests.userId', 'username email')
    .exec();
  
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }
  
    // Remap subdocs to use `id`
    const requests = (updated.requests || []).map(r => ({
      id: r._id.toString(),
      userId: {
        username: (r.userId as any).username,
        email: (r.userId as any).email,
      },
      message: r.message,
      fileUrl: r.fileUrl,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
    }));
  
    return NextResponse.json({ success: true, requests }, { status: 200 });
  }

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid task ID' }, { status: 400 });
  }
  
  const task = await Task.findById(id)
    .populate('requests.userId', 'username email')
    .exec();
  if (!task) {
    return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
  }

  // Map each subdoc's _id → id
  const requests = (task.requests || []).map(r => ({
    id: r._id.toString(),
    userId: {
      username: (r.userId as any).username,
      email: (r.userId as any).email,
    },
    message: r.message,
    fileUrl: r.fileUrl,
    status: r.status,
    createdAt: r.createdAt.toISOString(),
  }));

  return NextResponse.json({ success: true, requests }, { status: 200 });
}

