// src/models/TransactionModel.ts
import { Schema, model, models } from 'mongoose';

const TransactionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal'],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  method: { type: String, enum: ['manual', 'payeer'], default: 'payeer' },

  status: {
    type: String,
    enum: ['successful', 'failed'],
    required: true,
  },
});

const TransactionModel = models.Transaction || model('Transaction', TransactionSchema);

export default TransactionModel;
