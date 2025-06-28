import Task from "@src/models/taskModel";
import UserModel from "@src/models/userModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid task ID" },
      { status: 400 }
    );
  }

  try {
    const task = await Task.findById(id).exec();
    if (!task) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch task" },
      { status: 500 }
    );
  }
}

// Update task (PUT) – adds the current user to the taskDoneBy array
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid task ID" },
      { status: 400 }
    );
  }

  try {
    // Retrieve the current session to get the logged-in user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Destructure the fields you expect from the request body.
    // (Adjust the destructuring as needed.)
    const { status, notes, fileUrl, description, rating } =
      await request.json();

    // Find the user document based on session email
    const userDoc = await UserModel.findOne({ email: session.user.email });
    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update the task by setting the provided fields and
    // add the current user's _id to the taskDoneBy array.
    // $addToSet ensures the same user is not added multiple times.
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status,
        notes,
        fileUrl,
        description,
        rating,
        $addToSet: { taskDoneBy: userDoc._id }
      },
      { new: true }
    );

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Failed to update task" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Task updated successfully", task: updatedTask },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: "Invalid task ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { message, fileUrl } = await request.json();
  const user = await UserModel.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }

  // Push into requests[]
  const updated = await Task.findByIdAndUpdate(
    id,
    {
      $push: {
        requests: {
          userId: user._id,
          message,
          fileUrl,
          status: "Pending",
          createdAt: new Date(),
        }
      }
    },
    { new: true }
  ).populate<{ requests: { userId: typeof user._id; message: string; fileUrl: string; status: string; createdAt: Date }[] }>("requests.userId", "username email");

  if (!updated) {
    return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, requests: updated.requests }, { status: 200 });
}
    
    
 
    



    
    // post method for reviewsing and editing task details
    
    // export async function POST(request: NextRequest, {params}: {params: {
        //     id: string
// }}) {
    //     await dbConnect();
    
    //     const {id} = params;
    
    //     console.log("this is the taskId from url params: ", id);
    
    //     // check if the taskId is valid 
    //     if( !Types.ObjectId.isValid(id)) {
        //         return NextResponse.json(
            //             {success: false,
            //             message: "Invalid task ID",
            //             },
            //             {status: 400}
            //         )
            //     }
            
            //     try {
//         const {rating, description, status} = await request.json();


//         const updateTask = await Task.findOneAndUpdate(
    //             {id: id},
    //             {
        //                 rating: rating,
        //                 description: description,
        //                 status: status,
        //             },
        //             {new: true}
        //         )
        
        //         if(!updateTask) {
            //             return NextResponse.json({
                //                 success: false,
                //                 message: 'Failed to update Task'
                //             }, {status: 404})
                //         }
                //         console.log(updateTask);
                //     return NextResponse.json({
                    //     success: true,
                    //     message: "task updated successfully",
                    //     task: updateTask
                    //     }, { status: 200 });
                    
                    //     } catch (error) {
//         console.error("error updating task: ", error);
//         return NextResponse.json({
//             success: false,
//             message: 'Internal server error'
//         },{ status: 500 })
//     }
// }

// // Check if the status is either 'approved' or 'rejected'
// const validStatuses = ["approved", "rejected"];
// if (status && !validStatuses.includes(status)) {
//     return NextResponse.json(
//         { success: false, message: "Invalid status value" },
//         { status: 400 }
//     );
// }
