import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { Types } from "mongoose";
import { date } from "zod";



export async function POST(request: Request) {
    await dbConnect()
    
    try {
        const {username, phoneNumber, email, password, gender, age} =  await request.json()
       
       
       
        // existing user by username
        const existingUserVerifiedByUsername = await UserModel.findOne({username, isVerified: true})
    
    if(existingUserVerifiedByUsername) {
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {status: 400})
    }
    
    
    
    
    // existing user by email
    const  existingUserByEmail = await UserModel.findOne({email});
    
    
    // existing user by phoneNumber
    const existingUserByPhoneNumber = await UserModel.findOne({phoneNumber});
    
    
    // verify code generation
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
    
    
    if(existingUserByEmail && existingUserByPhoneNumber) {
        if(existingUserByEmail.isVerified) {
            return Response.json({
                success: false,
                message: "User already exists with this email",
            }, {status: 400})
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry= new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }
    } 
    else {
        const hashedPassword = await bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours() + 1)
        
        
        // newUser model created 
        
        const newUser = new UserModel({
            email,
            username,
            phoneNumber,
            password: hashedPassword,
            isVerified: false,
            isAcceptingMessages: true,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            gender: gender,
            age: age,
            referredBy: Types.ObjectId,
            messages: [],
            tasks: [],
        })
        await newUser.save();
        
    }
    
        // send verification email and verification otp in phone
    
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        
        if(!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            }, {status: 500})
        }
        
        return Response.json({
            success: true,
            message: "User registered successfully. Please verify email",
        }, {status: 201})
     
    
    } catch (error) {
        console.log("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}
