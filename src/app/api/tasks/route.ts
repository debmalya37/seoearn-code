// app/api/tasks/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task from '../../../models/taskModel';
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    Hello: "world",
  });
}

export async function POST(request: Request) {
  try {
    // Ensure the request body is parsed correctly
    const body = await request.json();

    // Connect to the database
    try {
      await dbConnect();
    } catch (dbError:any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json({
        message: "Database connection failed",
        error: dbError.message,
      }, { status: 500 });
    }

    // Create a new task
    const task = await Task.create(body);

    return NextResponse.json({
      message: "task created successfully",
      task,
    });
  } catch (error: any) {
    return NextResponse.json({
      message: "task creation failed",
      error: error.message,
    }, { status: 400 });
  }
}



// export async function POST(request: NextApiRequest) {
//   const {
//     title, 
//     description,
//     rating,
//     category,
//     duration,
//     createdBy,
//     reward
//   } = await request.body({Message: "topic added"});
// }


// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await dbConnect();
//   console.log(dbConnect);
//   const { method } = req;

  // switch (method) {
  //   case 'GET':
  //     try {
  //       const tasks = await Task.find({});
  //       res.status(200).json({ success: true, data: tasks });
  //     } catch (error:any) {
  //       console.log("error fetching data: ",error.message);
  //       res.status(400).json({ success: false, error: error.message });
  //     }
  //     break;
  //   // case 'POST':
  //   //   try {
  //   //     const task = await Task.create(req.body);
  //   //     res.status(201).json({ success: true, data: task });
  //   //   } catch (error:any) {
  //   //     res.status(400).json({ success: false, error: error.message });
  //   //   }
  //     // break;
  //   default:
  //     res.setHeader('Allow', ['GET', 'POST']);
  //     res.status(405).end(`Method ${method} Not Allowed`);
  //     break;
  // }
// }
