import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import UserModel, { IUser } from '@src/models/userModel';
import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

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
      status: 1
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

// POST endpoint to create a new task
export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }
  const userEmail = session.user.email;
  const user = await UserModel.findOne({ email: userEmail }) as IUser;

  if (!user) {
    return NextResponse.json(
      {
        success: false,
        message: "User not found",
      },
      { status: 404 }
    );
  }

  try {
    const { title, description, rating, category, duration, reward, status } = await request.json();

    // Validation checks
    if (!title || !description || !category || !duration || !reward) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }
    
    const newTask = await Task.create({ title, description, rating, category, duration, createdBy: user._id, reward, status });

    if (!user.tasks) {
      user.tasks = [];
    }
    user.tasks.push(newTask.id);
    await user.save();

    return NextResponse.json({ success: true, message: "Task Created", task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Failed to add new task", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add task",
      },
      { status: 500 }
    );
  }
}