import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect;

  const { id } = params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return NextResponse.json({ success: false, message: 'Task not found' }, { status: 404 });
    }

    if (task.status !== 'In Progress') {
      return NextResponse.json({ success: false, message: 'Only In Progress tasks can be completed' }, { status: 400 });
    }

    task.status = 'Completed';
    await task.save();

    return NextResponse.json({ success: true, message: 'Task marked as completed' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
