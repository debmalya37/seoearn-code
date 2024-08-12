import mongoose, { Document, Schema, Types } from 'mongoose';

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
  user: never[];
  _id: Types.ObjectId;
  email: string;
  name: string;
  username: string;
  phoneNumber?: number;
  password?: string;
  isVerified: boolean;
  isAcceptingMessages?: boolean;
  verifyCode?: string;
  verifyCodeExpiry?: Date;
  gender?: string;
  dob?: Date;
  age?: number;
  profilePicture?: string;
  paymentId?: string;
  payerAccount?: string;
  totalAmount?: number;
  paymentPreference?: string;
  paymentGateway?: string;
  messages?: IMessage[];
  tasks?: Types.ObjectId[];
  referredBy?: Types.ObjectId;
  // deviceIdentifier?: string;
  balance?: number;
  earnings?: number;
  referralCode?: string;
  referrals?: Types.Array<Types.ObjectId>;
  referralEarnings?: number;
  referralCount?: number;
  country?: String;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
  name: { type: String },
  username: { type: String, required: true, trim: true, unique: true },
  phoneNumber: { type: Number },
  password: { type: String },
  gender: { type: String, enum: ['male', 'female', 'other']},
  age: { type: Number , min: 0},
  dob: {type: Date},
  profilePicture: { type: String },
  paymentPreference: { type: String },
  paymentGateway: { type: String },
  paymentId: { type: String, default: '123456' },
  payerAccount: { type: String },
  totalAmount: { type: Number, default: 0 },
  verifyCode: { type: String },
  verifyCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // deviceIdentifier: { type: String },
  balance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  referralCode: { type: String },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  referralEarnings: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  country: {type: String},
});

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserModel;
