// src/models/walletModel.ts
import mongoose, { Schema, model, models } from 'mongoose';

/**
 * We keep a separate Wallet collection so that we can lock funds or handle
 * special rounding without altering User.balance directly.
 */
const WalletSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },      // available balance
  locked: { type: Number, default: 0 },       // funds locked for pending withdrawals
});

const Wallet = models.Wallet || model('Wallet', WalletSchema);
export default Wallet;
