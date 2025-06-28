// src/app/api/referral/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

interface SignUpPayload {
  email: string;
  name: string;
  username: string;
  password: string;
  /** Optional query param from URL: the referral code of the referrer. */
  ref?: string;
}

// Helper to count second-level referrals for a given user
async function countSecondLevel(referrerId: string) {
  // 1. Find all first-level referrals of referrerId
  const firstLevelUsers = await UserModel.find({ referredBy: referrerId }).select('_id').exec();
  if (firstLevelUsers.length === 0) return 0;

  // 2. For each of those, count how many users they referred
  const firstLevelIds = firstLevelUsers.map((u) => u._id);
  const secondLevelCount = await UserModel.countDocuments({ referredBy: { $in: firstLevelIds } }).exec();
  return secondLevelCount;
}

export async function POST(req: NextRequest) {
  /**
   * 1. Connect to DB
   * 2. Parse JSON body with { email, name, username, password, ref? }
   * 3. If ref is provided, find the user whose referralCode === ref. If found, set referredBy on new user.
   * 4. Hash password; create the new user document.
   * 5. If referredBy was set, push new user._id into that referrer’s `referrals` array and bump `referralCount`.
   */
  try {
    await dbConnect();
    const body: SignUpPayload = await req.json();
    const { email, name, username, password, ref } = body;

    if (!email || !name || !username || !password) {
      return NextResponse.json({ success: false, message: 'Missing fields.' }, { status: 400 });
    }

    // 1. Make sure email/username are unique
    const existingEmail = await UserModel.findOne({ email }).exec();
    if (existingEmail) {
      return NextResponse.json({ success: false, message: 'Email already in use.' }, { status: 400 });
    }
    const existingUsername = await UserModel.findOne({ username }).exec();
    if (existingUsername) {
      return NextResponse.json({ success: false, message: 'Username already in use.' }, { status: 400 });
    }

    // 2. Determine if there's a valid referrer
    let referredByUserId: string | null = null;
    if (ref) {
      const referrer = await UserModel.findOne({ referralCode: ref }).exec();
      if (referrer) {
        referredByUserId = referrer._id.toString();
      }
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create new user
    const newUser = new UserModel({
      email,
      name,
      username,
      password: hashedPassword,
      referredBy: referredByUserId ? referredByUserId : null,
      balance: 0,
      earnings: 0,
      referralEarnings: 0,
      referralCount: 0,
      referrals: [],
      // Generate a unique referralCode for them right away
      referralCode: `${username}${Math.floor(1000 + Math.random() * 9000)}`, 
    });
    await newUser.save();

    // 5. If we found a valid referrer, update their referrals list & count
    if (referredByUserId) {
      const referrer = await UserModel.findById(referredByUserId).exec();
      if (referrer) {
        referrer.referrals = referrer.referrals || [];
        referrer.referrals.push(newUser._id);
        referrer.referralCount = (referrer.referralCount || 0) + 1;
        await referrer.save();
      }
    }

    // 6. Return basic info (you might want to also sign them in, etc.)
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully.',
        user: {
          _id: newUser._id,
          email: newUser.email,
          username: newUser.username,
          referralCode: newUser.referralCode,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in referral sign-up POST:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  /**
   * 1. Connect to DB
   * 2. Get current authenticated user via next-auth
   * 3. Fetch that user’s document (populate direct `referrals` array)
   * 4. Count second-level referrals
   * 5. Build a payload: { referralCode, referralLink, firstLevelCount, secondLevelCount, totalReferralEarnings, firstLevelReferrals: [ { username, email, referralCount } ] }
   */
  try {
    await dbConnect();
    // 2. Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    }

    // 3. Fetch current user by email
    const foundUser = await UserModel.findOne({ email: session.user.email })
      .populate({
        path: 'referrals',
        select: 'username email referralCount',
      })
      .exec();

    if (!foundUser) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // 4. Count second-level referrals
    const secondLevelCount = await countSecondLevel(foundUser._id.toString());

    // 5. Build response payload
    const origin = req.nextUrl.origin;
    const referralLink = `${origin}/sign-up?ref=${foundUser.referralCode}`;

    const firstLevelReferrals = (foundUser.referrals || []).map((r: any) => ({
      username: r.username,
      email: r.email,
      referralCount: r.referralCount || 0,
    }));

    return NextResponse.json(
      {
        success: true,
        data: {
          referralCode: foundUser.referralCode,
          referralLink,
          firstLevelCount: foundUser.referralCount || 0,
          secondLevelCount,
          totalReferralEarnings: foundUser.referralEarnings || 0,
          firstLevelReferrals,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in referral GET:', error);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
