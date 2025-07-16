import Task from "@src/models/taskModel";
import UserModel from "@src/models/userModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/[...nextauth]/options";
// import { addToWallet } from "@src/lib/walletUtils";
// at top of src/app/api/tasks/[id]/route.ts
import { addToWallet, rewardReferralLevels } from '@src/lib/walletUtils'

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
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const taskId = params.id;
  if (!Types.ObjectId.isValid(taskId)) {
    return NextResponse.json({ success: false, message: "Invalid task ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
  }

  const {
    status,
    submissionId,
    notes,
    description,
    rejectionReason
  } = await req.json() as {
    status: "approved" | "rejected";
    submissionId: string;
    notes?: string;
    description?: string;
    rejectionReason?: string;
  };

  if (!["approved", "rejected"].includes(status)) {
    return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
  }

  await dbConnect();

  const task = await Task.findById(taskId);
  if (!task) {
    return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
  }

  // 1️⃣ Update the submission entry
  const entry = task.requests.find(r => r._id.toString() === submissionId);
  if (!entry) {
    return NextResponse.json({ success: false, message: "Submission not found" }, { status: 404 });
  }
  entry.status = status === "approved" ? "Approved" : "Rejected";
  if (notes)        entry.message         = notes;
  if (description)  entry.fileUrl         = description;
  if (status === "rejected" && rejectionReason) {
    entry.rejectionReason = rejectionReason;
  }

  await task.save();

  // 2️⃣ Handle finances & referral on approval
  if (status === "approved") {
    const submitterId = entry.userId.toString();
    const rewardAmt   = task.reward;

    // credit the submitter and their referrers
    await addToWallet(submitterId, rewardAmt, "earning", `Task ${taskId} approved`);
    await rewardReferralLevels(submitterId, rewardAmt);
  }

  // 3️⃣ Update Tasker’s consecutiveRejections & ratings
  
  const submitterId = entry.userId.toString();
const submitter = await UserModel.findById(submitterId);
if (!submitter) {
  return NextResponse.json({ success: false, message: 'Submitter not found' }, { status: 404 });
}
if (status === 'approved') {
  // any time they get an approval, reset their rejection streak
  submitter.consecutiveRejections = 0;
} else {
  // increment their rejection streak
  submitter.consecutiveRejections = (submitter.consecutiveRejections || 0) + 1;

  // every 10 straight rejected submissions → drop average by 1
  if (submitter.consecutiveRejections % 10 === 0) {
    const N = Array.isArray(submitter.ratings) ? submitter.ratings.length : 0;
    if (N > 0) {
      const prevAvgSlot = typeof submitter.ratings[0] === 'number' ? submitter.ratings[0] : 0;
      // to lower the *average* by exactly 1 point, subtract N from the sum slot:
      submitter.ratings[0] = prevAvgSlot - N;
    }
  }
}
await submitter.save();

  return NextResponse.json({
    success: true,
    message: `Submission marked ${status}`,
    task,
  });
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
//         const {ratings, description, status} = await request.json();


//         const updateTask = await Task.findOneAndUpdate(
    //             {id: id},
    //             {
        //                 ratings: ratings,
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
