// src/models/adsRevenueModel.ts
import mongoose, { Schema, model, models, Model, Document, Types } from 'mongoose';

export interface IAdsRevenue extends Document {
  userId:    Types.ObjectId;  // advertiser
  email:     string;
  taskId:    Types.ObjectId;  // the ad they created
  grossBudget: number;        // e.g. 100
  feeAmount:   number;        // 20% of grossBudget
  netBudget:   number;        // grossBudget − feeAmount
  createdAt:   Date;
}

const AdsRevenueSchema = new Schema<IAdsRevenue>({
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email:       { type: String, required: true },
  taskId:      { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  grossBudget: { type: Number, required: true },
  feeAmount:   { type: Number, required: true },
  netBudget:   { type: Number, required: true },
  createdAt:   { type: Date, default: Date.now },
});

export const AdsRevenue: Model<IAdsRevenue> =
  models.AdsRevenue || model<IAdsRevenue>('AdsRevenue', AdsRevenueSchema);
