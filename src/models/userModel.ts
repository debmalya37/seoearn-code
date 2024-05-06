import { Document, Model, model, Schema } from 'mongoose';

export interface UserDocument extends Document {
  email: string;
  username: string;
  phoneNumber: string;
  gender: string;
  age: number;
}

const userSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },
});

export const UserModel: Model<UserDocument> = model<UserDocument>('User', userSchema);
