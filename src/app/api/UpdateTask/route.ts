import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@/models/taskModel';

export async function PATCH(request: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {});

    const { taskId, status, rating } = await request.json();

    const task = await Task.findById(taskId);
    if (task) {
      task.status = status;
      task.rating = rating;
      await task.save();
    }

    return NextResponse.json({ message: 'Task updated successfully' });
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 });
  }
}
