import mongoose, { Schema, Document, Model, model } from 'mongoose';
import { string } from 'zod';

// Define the ITask interface extending Document from Mongoose
export interface ITask extends Document {
  status: string;
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string; // Adjusted to ObjectId
  reward: number;
  createdAt: Date;
}

// Define the Task schema
const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User', // Assuming there's a User model
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true
  }
});

// Ensure the Task model uses the ITask interface
const Task: Model<ITask> = mongoose.models.Task || model<ITask>('Task', TaskSchema);
export default Task;
