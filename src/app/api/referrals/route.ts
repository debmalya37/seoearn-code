import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { authOptions } from '../auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';

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

    // Aggregation pipeline
    const referralsAggregationPipeline = [
      { $match: { _id: userId } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'referredBy',
          as: 'referrals'
        }
      },
      {
        $project: {
          totalReferrals: { $size: "$referrals" },
          referralList: {
            $map: {
              input: "$referrals",
              as: "referral",
              in: { name: "$$referral.username", email: "$$referral.email" }
            }
          }
        }
      }
    ];

    // Execute the aggregation pipeline
    const [referralStats] = await User.aggregate(referralsAggregationPipeline);

    return NextResponse.json({
      referralStats
    });
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return NextResponse.json({ error: 'Failed to fetch referrals' }, { status: 500 });
  }
}
