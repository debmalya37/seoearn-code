import mongoose, { Document, Schema, Types } from 'mongoose';
import { ITask, TaskSchema } from '@/models/taskModel';

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export interface IUser extends Document {
  email: string;
  username: string;
  phoneNumber: string;
  password: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  gender: string;
  age: number;
  profilePicture?: string;
  paymentPreference?: string;
  paymentGateway?: string;
  messages: IMessage[];
  tasks?: Types.Array<Types.ObjectId>; // Update tasks to be an array of ObjectId
  referredBy?: Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
  username: { type: String, required: true, trim: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  profilePicture: { type: String, required: false },
  paymentPreference: { type: String, required: false },
  paymentGateway: { type: String, required: false },
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
