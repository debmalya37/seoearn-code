// userAccount/route.ts
import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@src/models/userModel';
import TaskModel from '@src/models/taskModel';
import dbConnect from '@src/lib/dbConnect';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  await dbConnect();
  
  try {
    const user = await UserModel.findOne({ username: params.username }).exec();
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    const tasks = await TaskModel.find({ createdBy: user._id }).exec();
    const totalIncome = tasks.reduce((sum, task) => sum + task.reward, 0);

    return NextResponse.json({
      success: true,
      user: {
        ...user.toObject(),
        totalTasks: tasks.length,
        totalIncome,
      },
      tasks,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
}
}
