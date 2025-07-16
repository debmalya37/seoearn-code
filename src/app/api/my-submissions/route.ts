// src/app/api/my-submissions/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';
import UserModel from '@src/models/userModel';

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  await dbConnect();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) return NextResponse.json({ success: false, message: 'No user found' }, { status: 404 });

  const tasks = await Task.find({
    'requests.userId': user._id
  }).lean();

  const submissions = tasks.flatMap(task =>
    task.requests
      .filter(r => r.userId.toString() === user._id.toString())
      .map(r => ({
        taskId: task._id,
        title: task.title,
        description: task.description,
        reward: task.reward,
        status: r.status,
        submittedAt: r.createdAt,
        fileUrl: r.fileUrl,
        notes: r.message,
      }))
  );

  return NextResponse.json({ success: true, submissions });
}
