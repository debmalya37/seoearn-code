// profile/route.ts

import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@src/models/userModel';
import dbConnect from '@src/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ 
      success: false,
      message: 'Not authenticated' 
    }, { status: 401 });
  }

  const userEmail = session.user.email;
  try {
    const foundUser = await UserModel.findOne({ email: userEmail });

    if (!foundUser) {
      return NextResponse.json({
        success: false,
        message: "Failed to find user"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User data fetched successfully",
      user: foundUser
    }, { status: 200 });

  } catch (error) {
    console.error("Error finding user data:", error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ 
      success: false,
      message: 'Not authenticated' 
    }, { status: 401 });
  }

  const userEmail = session.user.email;
  try {
    const { phoneNumber, profilePicture, paymentPreference, paymentId, referralCode } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { email: userEmail },
      {
        phoneNumber: phoneNumber,
        profilePicture: profilePicture,
        paymentPreference: paymentPreference,
        paymentId: paymentId,
        referralCode: referralCode // Assuming you are passing referralCode
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update user'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}
