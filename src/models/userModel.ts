// src/models/userModel.ts
import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INotification {
  message: string;
  fromUsername: string;
  date: Date;
  read: boolean;
}

const NotificationSchema: Schema<INotification> = new mongoose.Schema({
  message: { type: String, required: true },
  fromUsername: { type: String, required: true },
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export interface IBankAccount {
  _id?: Types.ObjectId;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifsc?: string;                // For India-style bank transfer
  routingNumber?: string;       // For US-style ACH
  verified: boolean;
  verificationCode?: string;    // e.g., micro-deposit code
  createdAt: Date;
}

const BankAccountSchema = new mongoose.Schema<IBankAccount>({
  bankName: { type: String, required: true },
  accountHolderName: { type: String, required: true },
  accountNumber: { type: String, required: true },
  ifsc: { type: String },
  routingNumber: { type: String },
  verified: { type: Boolean, default: false },
  verificationCode: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<IMessage> = new mongoose.Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now },
});

export interface ITransaction extends Document {
  orderId?: string; 
  type: 'deposit' | 'withdrawal';
  nativeAmount: number; // amount in the user’s chosen currency
  nativeCurrency: string; // ISO currency code, e.g. "RUB", "EUR", "USD"
  usdAmount: number; // USD equivalent of nativeAmount at time of transaction
  amount: number;
  method: 'manual' | 'payeer'; // payment method, e.g. 'manual', 'payeer'
  date: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  providerTxId?: string;          // Payeer’s transaction or payout ID
  details?: Record<string, any>;  // extra metadata (e.g. payout destination)
}
// src/models/transactionModel.ts

const TransactionSchema: Schema<ITransaction> = new mongoose.Schema({
  orderId:        { type: String, unique: true },
  type:           { type: String, enum: ['deposit', 'withdrawal'], required: true },
  // the amount in the user’s chosen currency
  nativeAmount:   { type: Number, required: true },
  // ISO currency code, e.g. "RUB", "EUR", "USD"
  nativeCurrency: { type: String, required: true },
  method: { type: String, enum: ['manual', 'payeer'], default: 'payeer' },

  // the USD equivalent of nativeAmount at time of transaction
  usdAmount:      { type: Number, required: true },
  date:           { type: Date, default: Date.now },
  status:         { type: String, enum: ['pending','processing','completed','failed'], default: 'pending' },
  providerTxId:   { type: String, default: null },
  details:        { type: Schema.Types.Mixed, default: {} },
});


export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  name: string;
  username: string;
  is18Plus?: boolean; // for age verification
  phoneNumber?: string;
  password?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
emailVerificationOTP: string | null;

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
  referredBy?: string | null;
  balance: number;
  earnings?: number;
  referralCode?: string;
  referrals?: Types.Array<Types.ObjectId>;
  notifications?: INotification[];
  referralEarnings?: number;
  referralCount?: number;
  country?: string;
  transactions?: ITransaction[]; 
  ratings?: number[];
  isBlocked?: boolean;
  isHidden?: boolean; // for admin use, to hide user from public listings
  bankAccounts: IBankAccount[];
  resetOTP: string | null;
  consecutiveRejections?: number; // for tracking rejections in tasks
resetOTPExpires: Date | null;
  resetPasswordToken?: string
resetPasswordExpires?: Date

  // kyc related fields
  kycStatus?: 'unsubmitted' | 'pending' | 'verified' | 'rejected'
kycDocuments?: {
  idFrontUrl: string
  idBackUrl?: string
  selfieUrl: string
}
kycSubmittedAt?: Date
kycReviewedAt?: Date
kycReviewNotes?: string
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, match: [/.+\@.+\..+/, 'Please use a valid email address'] },
  name: { type: String },
  username: { type: String, required: true, trim: true, unique: true },
  phoneNumber: { type: String },
  password: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
  age: { type: Number, min: 0 },
  dob: { type: Date },
  isHidden: { type: Boolean, default: false }, // for admin use, to hide user from public listings
  is18Plus: { type: Boolean, default: false },
  profilePicture: { type: String },
  consecutiveRejections: { type: Number, default: 0 },
  paymentPreference: { type: String },
  paymentGateway: { type: String },
  paymentId: { type: String, default: '123456' },
  payerAccount: { type: String },
  totalAmount: { type: Number, default: 0 },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationOTP: {
    type: String,
    default: null,
  },  
  verifyCode: { type: String },
  verifyCodeExpiry: { type: Date },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessages: { type: Boolean, default: true },
  messages: [MessageSchema],
  tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
  referredBy: { type: String, default: null },
  balance: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
  referralCode: { type: String, unique: true, sparse: true },
  referrals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [NotificationSchema],
  referralEarnings: { type: Number, default: 0 },
  referralCount: { type: Number, default: 0 },
  country: { type: String },
  transactions: [TransactionSchema],
  ratings:      { type: [Number], default: [5] }, 
  isBlocked: { type: Boolean, default: false },
  bankAccounts: [BankAccountSchema],
  resetOTP:         { type: String, default: null },
  resetOTPExpires:  { type: Date,   default: null },
  resetPasswordToken: { type: String },
resetPasswordExpires: { type: Date },
  kycStatus: {
    type: String,
    enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
    default: 'unsubmitted'
  },
  kycDocuments: {
    idFrontUrl:  { type: String },
    idBackUrl:   { type: String },
    selfieUrl:   { type: String },
  },
  kycSubmittedAt: { type: Date },
  kycReviewedAt:  { type: Date },
  kycReviewNotes: { type: String },
});

const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default UserModel;
