import Task from "@src/models/taskModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        // Fetch tasks with status 'completed'
        const completedTasks = await Task.find({ status: 'Completed' }).exec();

        return NextResponse.json(
            { success: true, tasks: completedTasks },
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error fetching completed tasks:', error);

        return NextResponse.json(
            { success: false, message: "Failed to fetch completed tasks" },
            {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}
