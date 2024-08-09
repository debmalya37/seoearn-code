import Task from "@src/models/taskModel";
import dbConnect from "@src/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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
        return NextResponse.json(
            { success: true, task },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch task" },
            { status: 500 }
        );
    }
}
// update task PUT


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    const { id } = params;

    if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json(
            { success: false, message: "Invalid task ID" },
            { status: 400 }
        );
    }

    try {
        const { status, description, rating } = await request.json(); // Expecting JSON body

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { status, description, rating },
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
        console.error('Error updating task:', error);

        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
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

