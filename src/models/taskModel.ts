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
  isApproved?: Boolean, // Optional field to indicate if the task is approved
  isRejected?: Boolean, // Optional field to indicate if the task is rejected
  taskDoneBy?: mongoose.Types.ObjectId[]; 
  requests: IRequest[]; 
  submissions?: Array<{
    submittedBy?: string; // User ID of the submitter
    screenshotUrl?: string; // URL of the uploaded screenshot
    text?: string; // Textual details about the submission
    status: string; // 'pending', 'approved', 'rejected'
    taskDoneBy?: mongoose.Types.ObjectId[]; // Array of user IDs who have completed the task
    maxUsersCanDo: number;
    requests?: IRequest[];

  }>;
}

// Define the shape of each request entry
export interface IRequest {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  message?: string;
  fileUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'In Progress';
  createdAt: Date;
  rejectionReason?: string;
}

const RequestSubSchema = new Schema<IRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String },
    fileUrl: { type: String },
    status: {
      type: String,
      enum: ['Pending','Approved','Rejected','Completed','In Progress'],
      default: 'Pending',
    },
    rejectionReason: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }  // <<< Let Mongoose auto‑generate this subdoc `_id`
);

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
  isApproved: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  requests: [RequestSubSchema],
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
