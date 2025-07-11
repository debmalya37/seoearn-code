// src/app/api/referral/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import bcrypt from 'bcryptjs';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';


// Helper to count second-level referrals for a given user
async function countSecondLevel(referrerId: string) {
  const firstLevelUsers = await UserModel.find({ referredBy: referrerId }).select('_id').lean();
  if (!firstLevelUsers.length) return 0;
  const firstLevelIds = firstLevelUsers.map(u => u._id);
  return UserModel.countDocuments({ referredBy: { $in: firstLevelIds } });
}
interface SignUpPayload {
  email: string;
  name: string;
  username: string;
  password: string;
  /** Optional query param from URL: the referral code of the referrer. */
  ref?: string;
}

// // Helper to count second-level referrals for a given user
// async function countSecondLevel(referrerId: string) {
//   // 1. Find all first-level referrals of referrerId
//   const firstLevelUsers = await UserModel.find({ referredBy: referrerId }).select('_id').exec();
//   if (firstLevelUsers.length === 0) return 0;

//   // 2. For each of those, count how many users they referred
//   const firstLevelIds = firstLevelUsers.map((u) => u._id);
//   const secondLevelCount = await UserModel.countDocuments({ referredBy: { $in: firstLevelIds } }).exec();
//   return secondLevelCount;
// }

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
  try {
    await dbConnect();

    // 1. Authenticate
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 });
    }

    // 2. Load user
    const user = await UserModel.findOne({ email: session.user.email })
      .populate({ path: 'referrals', select: 'username email referralCount' })
      .lean() as { _id: string; referralCount?: number; referrals?: any[]; referralCode?: string; referralEarnings?: number; transactions?: any[] };
    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 });
    }

    // 3. Compute counts
    const firstLevelCount = user?.referralCount || 0;
    const secondLevelCount = await countSecondLevel(user._id.toString());

    // 4. Build referral link
    const origin = req.nextUrl.origin;
    const referralLink = `${origin}/sign-up?ref=${user.referralCode}`;

    // 5. Pull referral transactions history
    //    filter user.transactions for those with details.source === 'referral'
    const history = (user.transactions || [])
      .filter(tx => tx.details?.source === 'referral')
      .map(tx => ({
        amount: tx.amount,
        date: tx.date,
        description: tx.details?.description || 'Referral bonus'
      }))
      .sort((a, b) => b.date.getTime() - a.date.getTime());

    // 6. Package first-level referral summaries
    const firstLevelReferrals = (user.referrals || []).map((r: any) => ({
      username: r.username,
      email:    r.email,
      referralCount: r.referralCount || 0
    }));

    // 7. Return all
    return NextResponse.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        referralLink,
        firstLevelCount,
        secondLevelCount,
        totalReferralEarnings: user.referralEarnings || 0,
        firstLevelReferrals,
        history
      }
    });
  } catch (err: any) {
    console.error('Error in GET /api/referral:', err);
    return NextResponse.json({ success: false, message: 'Server error.' }, { status: 500 });
  }
}
