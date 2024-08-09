import Task from "@src/models/taskModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  await dbConnect();

  const { taskId } = params;

  if (!Types.ObjectId.isValid(taskId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid task ID",
      },
      { status: 400 }
    );
  }

  try {
    const task = await Task.findById(taskId).exec();

    if (!task) {
      return NextResponse.json(
        {
          success: false,
          message: "Task not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        task,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to fetch task", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch task",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { taskId: string } }) {
  await dbConnect();

  const { taskId } = params;

  if (!Types.ObjectId.isValid(taskId)) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid task ID",
      },
      { status: 400 }
    );
  }

  try {
    const { description } = await request.json();

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { description },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update task",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Task updated successfully",
        task: updatedTask,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update task", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update task",
      },
      { status: 500 }
    );
  }
}
