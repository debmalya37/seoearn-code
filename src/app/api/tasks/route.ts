import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel, { IUser } from '@src/models/userModel';
import { getServerSession } from 'next-auth';

export async function GET(request: Request) {
  try {
    // Connect to the database
    await dbConnect();

    const url = new URL(request.url);
    const query = url.searchParams;

    // Extract filter and sort parameters from the query
    const status = query.get('status') || '';
    const category = query.get('category') || '';
    const duration = query.get('duration') || '';
    const reward = query.get('reward') || '';
    const sortBy = query.get('sortBy') || 'createdAt';

    // Build the filter object based on the query parameters
    const filter: any = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (duration) {
      filter.duration = { $lte: Number(duration) }; 
    }
    if (reward) {
      filter.reward = { $gte: Number(reward) }; 
    }

    // Build the sort object based on the sortBy parameter
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sortBy === 'createdAt') {
      sortOptions.createdAt = -1; // Sort by latest
    } else if (sortBy === '-createdAt') {
      sortOptions.createdAt = 1; // Sort by oldest
    } else if (sortBy === 'reward') {
      sortOptions.reward = -1; // Sort by highest reward
    } else if (sortBy === '-reward') {
      sortOptions.reward = 1; // Sort by lowest reward
    }

    const tasks = await Task.find(filter).sort(sortOptions).exec();

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

// POST endpoint remains unchanged
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
