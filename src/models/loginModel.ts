import mongoose,{ Document, Schema, model, Types } from 'mongoose';

interface Login extends Document {
  userId: Types.ObjectId;
  email: string;
  password: string;
}

const LoginSchema = new Schema<Login>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const UserModel = (mongoose.models.User as mongoose.Model<Login>) || mongoose.model<Login>("Login", LoginSchema)