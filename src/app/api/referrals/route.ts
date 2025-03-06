import { NextRequest, NextResponse } from 'next/server';
import User from '@src/models/userModel';
import dbConnect from '@src/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Get the session user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Find the user by email and populate referrals
    const foundUser = await User.findOne({ email: session.user.email }).populate('referrals');
    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // If the user doesn't have a referral code, generate one using the email prefix and a random 4-digit number
    if (!foundUser.referralCode) {
      const emailPrefix = foundUser.email.split("@")[0];
      const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      const referralCode = emailPrefix + randomNumber;
      foundUser.referralCode = referralCode;
      await foundUser.save();
    }

    // Generate the referral link using the request origin
    const origin = req.nextUrl.origin;
    const referralLink = `${origin}/?ref=${foundUser.referralCode}`;

    // Prepare referral stats
    const totalReferrals = foundUser.referrals.length;
    const referralList = foundUser.referrals.map((referral: any) => ({
      name: referral.username,
      email: referral.email
    }));

    return NextResponse.json(
      {
        referralStats: {
          totalReferrals,
          referralList,
          referralCode: foundUser.referralCode,
          referralLink,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
