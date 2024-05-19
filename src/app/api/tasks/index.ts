
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import TaskModel, { Task } from '@/models/taskModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  

  if (req.method === 'POST') {
    try {
      const taskData: Task = req.body;
      const newTask = await TaskModel.create(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else { 
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
