import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { Types } from "mongoose";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, phoneNumber, email, password, gender, age, paymentPreference, paymentGateway, referredBy, deviceIdentifier} = await request.json();

    // Validate if required fields are provided
    if (!username || !phoneNumber || !email || !password || !gender || !age) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required",
        }),
        { status: 400 }
      );
    }

    // existing user by username
    const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });

    if (existingUserVerifiedByUsername) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Username is already taken",
        }),
        { status: 400 }
      );
    }
    // exising user by deviceIdentifier
    const existingUserByDeviceIdentifier = await UserModel.findOne({deviceIdentifier});
    // existing user by email
    const existingUserByEmail = await UserModel.findOne({ email });

    // existing user by phoneNumber
    const existingUserByPhoneNumber = await UserModel.findOne({ phoneNumber });

    // verify code generation
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail && existingUserByPhoneNumber && existingUserByDeviceIdentifier) {
      if (existingUserByDeviceIdentifier) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "One user is already associated with this Device, You can't make another account with this device",
          }),
          { status: 400 }
        );
      }
      if (existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            message: "User already exists with this email",
          }),
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Handle referredBy properly
      let referredByObjectId = null;
      if (referredBy && Types.ObjectId.isValid(referredBy)) {
        referredByObjectId = new Types.ObjectId(referredBy);
      }
      
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
        gender,
        age,
        paymentPreference,
        paymentGateway,
        referredBy: referredByObjectId, // Ensure valid ObjectId or null
        messages: [],
        tasks: [],
        deviceIdentifier,
      });
      await newUser.save();
    }

    // send verification email and verification otp in phone
    const emailResponse = await sendVerificationEmail(email, username, verifyCode);

    if (!emailResponse.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: emailResponse.message,
        }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "User registered successfully. Please verify email",
      }),
      { status: 201 }
    );
  } catch (error) {
    console.log("Error registering user", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error registering user",
      }),
      { status: 500 }
    );
  }
}
