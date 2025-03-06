import Task from "@src/models/taskModel";
import UserModel, { IUser } from "@src/models/userModel";
import { getServerSession, User } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@src/lib/dbConnect";
import { Types } from "mongoose";

// GET endpoint to fetch all tasks for the authenticated user
export async function GET(request: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  const userId = new Types.ObjectId(user._id);

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
    const tasksAggregation = [
      {
        $facet: {
          totalTasks: [{ $count: "count" }],
          tasklist: [
            {
              $project: {
                title: 1,
                description: 1,
                rating: 1,
                category: 1,
                createdAt: 1,
                createdBy: 1
              }
            }
          ],
          clicks: [
            {
              $match: { _id: userId } // Match tasks created by the current user
            },
            {
              $group: {
                _id: null,
                totalClicks: { $sum: 1 },
                totalFemaleClicks: {
                  $sum: { $cond: [{ $eq: ["$gender", "female"] }, 1, 0] }
                },
                totalMaleClicks: {
                  $sum: { $cond: [{ $eq: ["$gender", "male"] }, 1, 0] }
                },
                avgAge: { $avg: "$age" }
              }
            }
          ]
        }
      },
      {
        $project: {
          totalTasks: { $arrayElemAt: ["$totalTasks.count", 0] },
          totalList: "$tasklist",
          clicks: { $arrayElemAt: ["$clicks", 0] } // Extract clicks aggregation results
        }
      }
    ];

    const [taskPipeLine] = await Task.aggregate(tasksAggregation);

    const user = await UserModel.findOne({ email: session.user.email }).populate({
      path: 'tasks',
      populate: {
        path: 'taskDoneBy',
        model: 'User',
        select: 'username' // Only retrieve the username; adjust if you need more fields
      }
    }) as IUser;
    

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
