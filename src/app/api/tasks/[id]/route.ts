import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@src/lib/dbConnect';
import Task, { ITask } from '../../../../models/taskModel';

// Define a custom interface for the request with the id parameter
interface CustomRequest extends NextApiRequest {
  query: {
    id: string; // Assuming id is always a string in the query parameters
  };
}

// Connect to MongoDB
dbConnect();

// GET handler
export async function GET(req: CustomRequest, res: NextApiResponse, {params}: any) {
  const { id } = params;

  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: task });
  } catch (error:any) {
    res.status(400).json({ success: false, error: error.message });
  }
}

// PUT handler
export async function PUT(req: CustomRequest, res: NextApiResponse) {
  const { id } = req.query;

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
}

// DELETE handler
export async function DELETE(req: CustomRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const deletedTask = await Task.deleteOne({ _id: id });
    if (!deletedTask) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error:any) {
    res.status(400).json({ success: false, error: error.message });
  }
}
