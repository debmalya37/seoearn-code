import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  try {
    // Connect to MongoDB
    await dbConnect();

    // Get the session user
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({
        success: false,
        message: 'Not authenticated'
      }, { status: 401 });
    }

    const user = session.user;
    const userId = user._id;

    // Find the user by ID
    const foundUser = await User.findById(userId).populate('referrals');
    if (!foundUser) {
      return NextResponse.json({
        success: false,
        message: "User not found"
      }, { status: 404 });
    }

    // Get the referral data
    const totalReferrals = foundUser.referrals.length;
    const referralList = foundUser.referrals.map((referral: any) => ({
      name: referral.username,
      email: referral.email
    }));

    return NextResponse.json({
      referralStats: {
        totalReferrals,
        referralList,
        referralCode: foundUser.referralCode
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
