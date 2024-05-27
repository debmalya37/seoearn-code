import mongoose, { Document, Model, model, Types, Schema } from 'mongoose';
import  {TaskSchema}  from '@/models/taskModel';
import Task from '@/models/taskModel';
export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
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


export interface User extends Document {
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
  messages: Message[];
  tasks?: typeof Task[];
  referredBy?: Types.ObjectId;
}

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
  username: { type: String, required: true, trim: true, unique: true },
  phoneNumber: { type: String, required: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  profilePicture: { type: String, required: false },
  paymentPreference: { type: String, required: false }, // Changed to optional
  paymentGateway: { type: String, required: false },    // Changed to optional
  verifyCode: { type: String, required: true },
  verifyCodeExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
  tasks: [TaskSchema],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;
