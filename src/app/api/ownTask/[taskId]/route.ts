import Task from "@src/models/taskModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongodb";

// GET endpoint to fetch a single task by ID
export async function GET(request: NextRequest, { params }: { params: { taskId: string } }) {
  await dbConnect();

  const { taskId } = params;

  console.log("this is the taskId from URL params:", taskId);

  // Check if taskId is valid
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
    // Fetch the task by ID using Mongoose
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


  // Ensure the taskId is a valid ObjectId

  // const TaskId = new mongoose.Types.ObjectId(taskId as string)

  // if (!Types.ObjectId.isValid(TaskId)) {
  //   // console.log(taskID)
  //   console.log(taskId)
  //   // console.log(taskIdfetch)
  //   console.log(taskId)
  //   return Response.json(
  //     {
  //       success: false,
  //       message: "Invalid task ID",
  //       // taskIdfetch,
  //       TaskId,
  //       // typeTask,
  //     },
  //     { status: 400 }
  //   );
  // }

  // const taskAggregation = [
  //   { $match: { _id:  new ObjectId(TaskId) } },
  //   // {
  // //       $lookup: {
  // //         from: "users",
  // //         localField: "createdBy",
  // //         foreignField: "_id",
  // //         as: "createdBy",
  // //       },
  // //     },
  //     {
  //       $project: {
  //         title: 1,
  //         description: 1,
  //         rating: 1,
  //         category: 1,
  //         createdAt: 1,
  //         // createdBy: {
  //         //   _id: "$createdBy._id",
  //         //   name: "$createdBy.name",
  //         //   email: "$createdBy.email",
  //         // },
  //       },
  //     },


  // ];

  // const [task] = await Task.aggregate(taskAggregation);

//     if (!task) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Task not found",
//           // typeTask
//         },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         foundTask

//         // task,
//         // taskAggregation,
//         // typeTask
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Failed to fetch task", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to fetch task",
      
//       },
//       { status: 500 }
//     );
//   }
// }
