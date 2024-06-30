import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel, { IUser } from "@/models/userModel";
import mongoose from "mongoose";
import { User } from "next-auth";

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
    const { title, description, rating, category, duration, reward,createdAt } = await request.json();

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
    
    const newTask = await Task.create({ title, description, rating, category, duration, createdBy: user._id, reward, createdAt });

    if (!user.tasks) {
      user.tasks = [];
    }
    user.tasks.push(newTask._id);
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

// GET endpoint to fetch all tasks for the authenticated user
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
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
    console.error("Failed to fetch tasks", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tasks",
      },
      { status: 500 }
    );
  }
}
