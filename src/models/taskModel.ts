import { Document, Schema, model } from 'mongoose';

interface Task extends Document {
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'completed';
  duration: number; // Duration in minutes or hours
}

const taskSchema = new Schema<Task>({
  description: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  duration: { type: Number, required: true },
});

export default model<Task>('Task', taskSchema);
