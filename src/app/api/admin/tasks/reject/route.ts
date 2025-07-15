// src/app/api/tasks/reject/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { taskId } = await req.json();

    const task = await Task.findById(taskId);
    if (!task) return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });

    if (task.isRejected) return NextResponse.json({ success: false, message: 'Already rejected' }, { status: 400 });

    task.isRejected = true;
    await task.save();

    return NextResponse.json({ success: true, message: 'Task rejected' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
