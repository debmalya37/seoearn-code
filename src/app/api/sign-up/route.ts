import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@src/helpers/sendVerificationEmail";
import { Types } from "mongoose";
import { generateReferralCode } from "@src/app/utils/referral";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, phoneNumber, email, password, gender, age, paymentPreference, paymentGateway, referralCode, deviceIdentifier } = await request.json();

    if (!username || !phoneNumber || !email || !password || !gender || !age) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "All fields are required",
        }),
        { status: 400 }
      );
    }

    const existingUserByDeviceIdentifier = await UserModel.findOne({ deviceIdentifier });

    if (existingUserByDeviceIdentifier) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "One user is already associated with this device. You can't make another account with this device.",
        }),
        { status: 400 }
      );
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    const existingUserByPhoneNumber = await UserModel.findOne({ phoneNumber });

    if (existingUserByEmail) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists with this email",
        }),
        { status: 400 }
      );
    }

    if (existingUserByPhoneNumber) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User already exists with this phone number",
        }),
        { status: 400 }
      );
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryDate = new Date(Date.now() + 3600000);

    
    // create new user
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
      referredBy: null,
      messages: [],
      tasks: [],
      deviceIdentifier,
    });
    // Generate and assign referral code
    newUser.referralCode = generateReferralCode(username, newUser._id);

    // Handle referral code properly
    if (referralCode) {
      const referringUser = await UserModel.findOne({ referralCode });
      if (referringUser) {
        newUser.referredBy = referringUser._id; // set referredBy to referringUser's ID
        referringUser.referredUsers.push(newUser._id);
        await referringUser.save();
      }
    }
    await newUser.save();
    
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
