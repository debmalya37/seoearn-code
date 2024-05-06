import { verify } from "crypto";
import mongoose, {Schema, Document} from "mongoose";


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        required: [true, "please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    phoneNumber: {
        type: Number,
        required: [true, "please provide a valid phone number"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date
})