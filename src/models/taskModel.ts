import mongoose, { Schema, Document, Model, model } from 'mongoose';
import { string } from 'zod';

// Define the ITask interface extending Document from Mongoose
export interface ITask extends Document {
  maxUsersCanDo: number;
  status: string;
  title: string;
  description: string;
  notes?: string;
  fileUrl?: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  reward: number;
  budget: number;
  createdAt: Date;
  is18Plus?: Boolean,
  taskDoneBy?: mongoose.Types.ObjectId[]; 
  submissions?: Array<{
    submittedBy?: string; // User ID of the submitter
    screenshotUrl?: string; // URL of the uploaded screenshot
    text?: string; // Textual details about the submission
    status: string; // 'pending', 'approved', 'rejected'
    taskDoneBy?: mongoose.Types.ObjectId[]; // Array of user IDs who have completed the task
    maxUsersCanDo: number;

  }>;
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
  notes: {
    type: String,
  },
  fileUrl: {
    type: String,
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
  budget: { 
    type: Number, 
    required: true 
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    required: true
  },
  is18Plus: {
    type: Boolean,
    default: false
  } ,
    requests: [{
      userId: { type: mongoose.Types.ObjectId, ref: 'User' },
      message: { type: String, required: false },
      status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Completed', 'In Progress'], default: 'Pending' }
    }],
    taskDoneBy: [{
      type: mongoose.Types.ObjectId,
      ref: 'User',
    }],
    maxUsersCanDo: {
      type: Number,
      required: true,
      default: 1, // Set a default value or modify as needed
    },
});

// Ensure the Task model uses the ITask interface
const Task: Model<ITask> = mongoose.models.Task || model<ITask>('Task', TaskSchema);
export default Task;
