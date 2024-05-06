// src/models/Login.ts

import { Document, Schema, model, Types } from 'mongoose';

interface Login extends Document {
  userId: Types.ObjectId;
  email: string;
  password: string;
}

const loginSchema = new Schema<Login>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default model<Login>('Login', loginSchema);
