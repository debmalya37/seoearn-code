// import mongoose,{ Document, Schema, model } from 'mongoose';

// export interface Task extends Document {
//   description: string;
//   category: string;
//   status: 'pending' | 'in-progress' | 'completed';
//   duration: number; // Duration in minutes or hours
//   createdAt: Date
// }

// const TaskSchema = new Schema<Task>({
//   description: { type: String, required: true },
//   category: { type: String, required: true },
//   status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
//   duration: { type: Number, required: true },
//   createdAt: {type: Date, required: true, default: Date.now}
// });

// const TaskModel = (mongoose.models.Task as mongoose.Model<Task>) || mongoose.model<Task>("Task", TaskSchema)