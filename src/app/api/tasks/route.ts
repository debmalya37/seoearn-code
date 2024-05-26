import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import Task from "@/models/taskModel";


export async function POST(request: any) {
  const {title, description, rating, category, duration, createdBy, reward} = await request.json();
  await dbConnect();
  await Task.create({title, description, rating, category, duration, createdBy, reward});
  return NextResponse.json({message: "Task Created"}, {status: 201});
}

export async function GET(request:any) {
  await dbConnect();
  const tasks = await Task.find();
  return NextResponse.json({ tasks }); 
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
