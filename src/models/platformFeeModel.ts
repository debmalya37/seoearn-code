// src/models/platformFeeModel.ts
import mongoose, { Schema, model, Model, Document, Types } from 'mongoose';

export interface IPlatformFee extends Document {
  userId: Types.ObjectId;      // advertiser
  taskId: Types.ObjectId;      // ad they created
  grossBudget: number;         // e.g. 100
  feeAmount: number;           // 3% of 100 → 3
  netBudget: number;           // 97
  createdAt: Date;
} 

const PlatformFeeSchema = new Schema<IPlatformFee>({
  userId:    { type: Schema.Types.ObjectId, ref: 'User', required: true },
  taskId:    { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  grossBudget: { type: Number, required: true },
  feeAmount:   { type: Number, required: true },
  netBudget:   { type: Number, required: true },
  createdAt:   { type: Date, default: Date.now },
});

export const PlatformFee: Model<IPlatformFee> =
  mongoose.models.PlatformFee ||
  model<IPlatformFee>('PlatformFee', PlatformFeeSchema);
