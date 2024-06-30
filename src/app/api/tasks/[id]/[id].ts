import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@/lib/dbConnect';
import Task from '../../../../models/taskModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      try {
        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'PUT':
      try {
        const task = await Task.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
        if (!task) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: task });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    case 'DELETE':
      try {
        const deletedTask = await Task.deleteOne({ _id: id });
        if (!deletedTask) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error:any) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
