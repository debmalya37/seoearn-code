// src/app/api/sign-up/route.ts
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateReferralCode } from '@src/app/utils/referral';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const {
      name,
      username,
      phoneNumber, // now full international number e.g. "+91XXXXXXXXXX"
      email,
      password,
      gender,
      age,
      referralCode,       // optional ?ref=
      deviceIdentifier,
    } = await request.json();

    // 1. Basic validation
    // Instead of !age use a more precise check:
if (
  !name ||
  !username ||
  !phoneNumber ||
  !email ||
  !password ||
  !gender ||
  age == null  // only fail if age is null or undefined
) {
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

    // 5. Build new user
    const newUser = new UserModel({
      name,
      email,
      username,
      phoneNumber,
      password: hashedPassword,
      isVerified: true,
      isAcceptingMessages: true,
      gender,
      age,
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

    // 6. Generate a referral code
    newUser.referralCode = generateReferralCode(username, newUser._id.toString());

    // 7. Handle referrer if referralCode is present
    if (referralCode) {
      const referringUser = await UserModel.findOne({ referralCode });
      if (referringUser) {
        newUser.referredBy = referringUser._id;

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
      JSON.stringify({ success: false, message: (error as any).message }),
      { status: 500 }
    );
  }
}
