

import mongoose, { Document, Model, model, Schema } from 'mongoose';
export interface User extends Document {
  email: string;
  username: string;
  phoneNumber: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  gender: string;
  age: number;
}

const UserSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  age: { type: Number, required: true },

});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;