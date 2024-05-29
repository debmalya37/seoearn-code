import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel, { IUser } from "@/models/userModel";
import mongoose, { Types } from "mongoose";

export async function POST(request: Request) {
  const { title, description, rating, category, duration, createdBy, reward } = await request.json();
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

  const user = await UserModel.findById(session.user._id) as IUser;

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
    const newTask = await Task.create({ title, description, rating, category, duration, createdBy: user._id, reward });

    if (!user.tasks) {
      user.tasks = new mongoose.Types.Array<Types.ObjectId>();
    }
    user.tasks.push(newTask._id);
    await user.save();

    return NextResponse.json({ message: "Task Created" }, { status: 201 });
  } catch (error) {
    console.log("Failed to add new task", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to add task",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
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

  try {
    const user = await UserModel.findById(session.user._id).populate('tasks') as IUser;

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        tasks: user.tasks,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to fetch tasks", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}
