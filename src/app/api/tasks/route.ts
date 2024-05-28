import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Task from "@/models/taskModel";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/models/userModel";
import { User } from "next-auth";
import mongoose from "mongoose";
import  { ITask } from "@/models/taskModel";




export async function POST(request: Request) {
  const {title, description, rating, category, duration, createdBy, reward} = await request.json();
  await dbConnect();

  // before adding task, we need to check if the user is authenticated or not to prevent spam tasks and server loading
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

// getting the session authenticated user 
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated"
      }, {status: 401}
    )
  }

  const userId = user._id
  
  try {
    const newTask = {title, description, rating, category, duration, createdBy, reward};
    // create the task with required parameters
    await Task.create({title, description, rating, category, duration, createdBy, reward});
    user.messages?.push(newTask as ITask)



    return NextResponse.json({message: "Task Created"}, {status: 201});

  } 
  // error handling if it fails to add new task
  catch (error) {
    console.log("failed to add new task")
    return NextResponse.json(
      {
        success: false,
        message: "failed to add task"
      }, {status: 401}
    )
  }
  
}

export async function GET(request: Request) {
  await dbConnect();

  // before adding task, we need to check if the user is authenticated or not to prevent spam tasks and server loading
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

// getting the session authenticated user 
  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated"
      }, {status: 401}
    )
  }

  // const userId = user._id;
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: {id: userId}},
      {$unwind: '$tasks'},
      {$sort: {'tasks.createdAt': -1}},
      {$group: {_id: '$_id', messages: {$push: '$tasks'}}}
    ])

    if(!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found"
        }, {status: 404}
      )
    }

  {
    const tasks = await Task.find();
    
    if(!tasks) {
      return NextResponse.json(
        {
          success: false,
          message: "Tasks not Found"
        }, {status: 404}
        )
      }
        return NextResponse.json(
          {
            success: true,
            tasks: user[0].tasks
          }, {status: 200}
        ); 
        
  }
}

catch (error) {
  console.log("failed to Fetch Tasks")
  return NextResponse.json(
    {
        success: false,
        message: "failed to Fetch task"
      }, {status: 401}
    )
  }
}

// export async function DELETE(request:any) {
//   const id = Task.db.id;

// }
































// import { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '@/lib/dbConnect';
// import Task from '@/models/taskModel';

// async function connectToDatabase() {
//   try {
//     await dbConnect();
//     console.log('Database connected successfully');
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw new Error('Database connection error');
//   }
// }

// // Handle GET requests
// export async function GET(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   try {
//     const tasks = await Task.find({});
//     res.status(200).json({ success: true, data: tasks });
//   } catch (error: any) {
//     console.error('Error fetching data:', error.message);
//     res.status(400).json({ success: false, error: error.message });
//   }
// }

// // Handle POST requests
// export async function POST(req: NextApiRequest, res: NextApiResponse) {
//   await connectToDatabase();

//   const { title, description, rating, category, duration, createdBy, reward } = req.body;

//   if (!title || !description || !rating || !category || !duration || !createdBy || !reward) {
//     return res.status(400).json({ success: false, message: 'Missing required fields' });
//   }

//   try {
//     const task = await Task.create({
//       title,
//       description,
//       rating,
//       category,
//       duration,
//       createdBy,
//       reward,
//     });
//     res.status(201).json({ success: true, data: task });
//   } catch (error: any) {
//     console.error('Error creating task:', error.message);
//     res.status(500).json({ success: false, error: error.message });
//   }
// }

// // Handle unsupported methods
// export async function defaultHandler(req: NextApiRequest, res: NextApiResponse) {
//   res.setHeader('Allow', ['GET', 'POST']);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }

// // Export the default handler as the fallback for unsupported methods
// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   switch (req.method) {
//     case 'GET':
//       return GET(req, res);
//     case 'POST':
//       return POST(req, res);
//     default:
//       return defaultHandler(req, res);
//   }
// }
