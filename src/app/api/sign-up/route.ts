import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task from '../../../models/taskModel';

// Connect to the database
await dbConnect();

// GET method handler
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const tasks = await Task.find({});
    res.status(200).json({ success: true, data: tasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}

// POST method handler
export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Request body:', req.body); // Log the request body to debug
    const task = await Task.create(req.body);
    res.status(201).json({ success: true, data: task });
  } catch (error: any) {
    console.error('Error creating task:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}

// Default handler for unsupported methods
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
