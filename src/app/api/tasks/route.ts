import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Task from '@src/models/taskModel';
import { authOptions } from '../auth/[...nextauth]/options';
import UserModel, { IUser } from '@src/models/userModel';
import { getServerSession } from 'next-auth';


export async function GET(request: Request) {
  try {
    await dbConnect();

    const url = new URL(request.url);
    const query = url.searchParams;

    const status = query.get('status') || '';
    const category = query.get('category') || '';
    const duration = query.get('duration') || '';
    const reward = query.get('reward') || '';
    const sortBy = query.get('sortBy') || 'createdAt';
    const page = parseInt(query.get('page') || '1', 10);
    const limit = parseInt(query.get('limit') || '10', 10);

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

    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sortBy === 'createdAt') {
      sortOptions.createdAt = -1;
    } else if (sortBy === '-createdAt') {
      sortOptions.createdAt = 1;
    } else if (sortBy === 'reward') {
      sortOptions.reward = -1;
    } else if (sortBy === '-reward') {
      sortOptions.reward = 1;
    }

    const totalTasks = await Task.countDocuments(filter);
    const tasks = await Task.find(filter).sort(sortOptions).skip((page - 1) * limit).limit(limit).exec();

    return NextResponse.json({
      success: true,
      totalTasks,
      tasks
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
    const { title, description, rating, category, duration, reward, status, maxUsersCanDo} = await request.json();

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
    
    const newTask = await Task.create({ title, description, rating, category, duration, createdBy: user._id, reward, status, maxUsersCanDo });

    if (!user.tasks) {
      user.tasks = [];
    }
    user.tasks.push(newTask.id);
    await user.save();
    console.log("new task: ", newTask);

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
