import mongoose, { Schema, Document, Model, model } from 'mongoose';

export interface ITicket extends Document {
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  status: 'open' | 'closed' | 'in‑progress';
  createdAt: Date;
  updatedAt: Date;
}

const TicketSchema = new Schema<ITicket>({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  userId:      { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status:      { type: String, enum: ['open','in‑progress','closed'], default: 'open' },
}, { timestamps: true });

const Ticket: Model<ITicket> = mongoose.models.Ticket || model<ITicket>('Ticket', TicketSchema);
export default Ticket;
