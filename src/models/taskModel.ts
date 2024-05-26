import mongoose, { Schema, Document } from 'mongoose';

interface ITask extends Document {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: number;
  createdBy: string;
  reward: number;
}

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
    type: String,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
});

const Task =  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
export default Task;
