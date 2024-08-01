import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';

export async function GET() {
  try {
    // Connect to the database
    await dbConnect();

    // Fetch all tasks
    const tasks = await Task.find({}, {
      title: 1,
      description: 1,
      rating: 1,
      category: 1,
      duration: 1,
      createdBy: 1,
      reward: 1,
      createdAt: 1,
    });

    // Return the tasks
    return NextResponse.json({
      success: true,
      totalTasks: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch tasks' }, { status: 500 });
  }
}
