// src/app/api/sign-up/route.ts
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from '@src/app/utils/referral';
import { Types } from 'mongoose';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      username,
      phoneNumber,
      email,
      password,
      gender,
      age,
      paymentPreference,
      paymentGateway,
      referralCode,       // optional ?ref=
      deviceIdentifier,
    } = await request.json();

    // 1. Basic validation
    if (!username || !phoneNumber || !email || !password || !gender || !age) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'All fields are required',
        }),
        { status: 400 }
      );
    }

    // 2. One account per device
    const existingByDevice = await UserModel.findOne({ deviceIdentifier });
    if (existingByDevice) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "One user is already associated with this device. You can't make another account with this device.",
        }),
        { status: 400 }
      );
    }

    // 3. Uniqueness checks
    if (await UserModel.exists({ email })) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email already in use' }),
        { status: 400 }
      );
    }
    if (await UserModel.exists({ phoneNumber })) {
      return new Response(
        JSON.stringify({ success: false, message: 'Phone number already in use' }),
        { status: 400 }
      );
    }
    if (await UserModel.exists({ username, isVerified: true })) {
      return new Response(
        JSON.stringify({ success: false, message: 'Username is already taken' }),
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Build new user (referredBy will remain null unless we find a referrer)
    const newUser = new UserModel({
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      isVerified: true,
      isAcceptingMessages: true,
      gender,
      age,
      paymentPreference,
      paymentGateway,
      referredBy: null,      // <-- default
      messages: [],
      tasks: [],
      deviceIdentifier,
      balance: 0,
      earnings: 0,
      referralEarnings: 0,
      referralCount: 0,
      referrals: [],
      notifications: [],
    });

    // 6. Generate a referral code
    newUser.referralCode = generateReferralCode(username, newUser._id.toString());

    // 7. If someone passed in a `referralCode`, look up that user:
    if (referralCode) {
      const referringUser = await UserModel.findOne({ referralCode });
      if (referringUser) {
        // **Store the referrer’s _id**, not their email**
        newUser.referredBy = referringUser._id;

        // update referrer’s referrals list + count + notification
        referringUser.referrals = referringUser.referrals || [];
        referringUser.referrals.push(newUser._id);
        referringUser.referralCount = (referringUser.referralCount || 0) + 1;
        referringUser.notifications = referringUser.notifications || [];
        referringUser.notifications.push({
          message: `${newUser.username} used your referral code!`,
          fromUsername: newUser.username,
          date: new Date(),
          read: false,
        });
        await referringUser.save();
      }
    }

    // 8. Finally save the new user
    await newUser.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: 'User registered successfully',
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registering user:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Error registering user' }),
      { status: 500 }
    );
  }
}
