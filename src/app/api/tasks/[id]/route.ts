import Task from "@src/models/taskModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import { ObjectId } from "mongodb";


export async function GET(request: NextRequest, {params}: {params: {
    id: string
}}) {
    await dbConnect();

    const {id} = params;

    console.log("this is the taskId from url params: ", id);

    // check if the taskId is valid 
    if( !Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            {success: false,
            message: "Invalid task ID",
            },
            {status: 400}
        )
    }
    try {
        // fetch task by ID using mongoose
        const task = await Task.findById(id).exec();
        if(!task) {
            return NextResponse.json({
                success: false,
                message: "Task not found",
            },
            {status: 404}
            );
        }
        return NextResponse.json({
            success: true,
            task,
        },
        { status: 200 }

        )
    } catch (error) {
        console.log("failed to fetch task", error);
        return NextResponse.json({
            success: false,
            message: "failed to fetch task",

        },
        {status: 500}
        )
    }
}



