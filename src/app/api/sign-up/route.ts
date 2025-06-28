// src/app/api/sign-up/route.ts
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from '@src/app/utils/referral';

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
      referralCode,       // this is the referral code string from ?ref=
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

    // 2. Ensure one account per device
    const existingUserByDevice = await UserModel.findOne({ deviceIdentifier });
    if (existingUserByDevice) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "One user is already associated with this device. You can't make another account with this device.",
        }),
        { status: 400 }
      );
    }

    // 3. Check email/phone/username uniqueness
    const existingByEmail = await UserModel.findOne({ email });
    if (existingByEmail) {
      return new Response(
        JSON.stringify({ success: false, message: 'Email already in use' }),
        { status: 400 }
      );
    }

    const existingByPhone = await UserModel.findOne({ phoneNumber });
    if (existingByPhone) {
      return new Response(
        JSON.stringify({ success: false, message: 'Phone number already in use' }),
        { status: 400 }
      );
    }

    const existingByUsername = await UserModel.findOne({ username, isVerified: true });
    if (existingByUsername) {
      return new Response(
        JSON.stringify({ success: false, message: 'Username is already taken' }),
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create new user document (with referredBy initialized to null)
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
      /* Instead of an ObjectId, we'll store the referrer’s email as a string */
      referredBy: null,
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

    // 6. Generate and assign a unique referral code for this new user
    newUser.referralCode = generateReferralCode(username, newUser._id.toString());

    // 7. If an incoming referralCode exists, find the referring user by that code
    if (referralCode) {
      const referringUser = await UserModel.findOne({ referralCode });
      if (referringUser) {
        // Instead of ObjectId, set referredBy = referringUser.email:
        newUser.referredBy = referringUser.email;

        // Append this new user's ID to the referrer's "referrals" array
        referringUser.referrals = referringUser.referrals || [];
        referringUser.referrals.push(newUser._id);
        referringUser.referralCount = (referringUser.referralCount || 0) + 1;

        // Create a notification for the referrer
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

    // 8. Save the new user
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
