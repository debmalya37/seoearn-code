import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Task from '@/models/taskModel';

export async function DELETE(request: Request) {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {});

    const { taskId } = await request.json();

    await Task.findByIdAndDelete(taskId);

    return NextResponse.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}
