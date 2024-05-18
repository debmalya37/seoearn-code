import mongoose, { Document, Model, model, Types, Schema } from 'mongoose';


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
  messages: Message[];
  tasks: Tasks[];
  referredBy: Types.ObjectId;

}

const UserSchema = new Schema<User>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: [/.+\@.+\..+/, 'Please use a valid email address'],
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    unique: true,
  },
  phoneNumber: { type: String, required: true },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
  verifyCode: {
    type: String,
    required: [true, 'Verify Code is required'],
  },

  verifyCodeExpiry: {
    type: Date,
    required: [true, 'Verify Code Expiry is required'],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],
  tasks: [TaskSchema],


  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',

  }
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;