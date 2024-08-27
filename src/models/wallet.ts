import mongoose, { Schema, model, models } from 'mongoose';

const WalletSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  balance: { type: Number, default: 0 },
});

const Wallet = models.Wallet || model('Wallet', WalletSchema);
export default Wallet;
