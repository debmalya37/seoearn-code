import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@src/lib/dbConnect";
import Task from "@src/models/taskModel";
import User from "@src/models/userModel";
import { Types } from "mongoose";

// Helper function to send notifications (you can adjust this based on your actual notification system)
const sendNotification = async (userId: Types.ObjectId, message: string) => {
  // Assuming you have a notification service or model
  // This is just a placeholder function
  console.log(`Notification sent to user ${userId}: ${message}`);
};

export async function POST(request: NextRequest, { params }: { params: { taskId: string } }) {
    await dbConnect();
  
    const { taskId } = params;

    if (!Types.ObjectId.isValid(taskId)) {
        return NextResponse.json(
            { success: false, message: "Invalid task ID" },
            { status: 400 }
        );
    }

    try {
        const { file, notes } = await request.json();
        
        // Fetch the task and owner
        const task = await Task.findById(taskId).populate('createdBy').exec();
        if (!task) {
            return NextResponse.json(
                { success: false, message: "Task not found" },
                { status: 404 }
            );
        }

        // Fetch the task owner
        const taskOwner = task.createdBy as unknown as { _id: Types.ObjectId, username: string };

        // Send notification to the task owner
        const message = `A request has been sent by a freelancer for your task: ${task.title}. Additional notes: ${notes || 'No additional notes.'}`;
        await sendNotification(taskOwner._id, message);

        return NextResponse.json(
            { success: true, message: "Request sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to send request" },
            { status: 500 }
        );
    }
}
