import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@src/models/userModel';
import dbConnect from '@src/lib/dbConnect';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';
import { generateReferralCode } from '@src/app/utils/referral';


// Handle GET requests
export async function GET(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession( authOptions );

  if (!session || !session.user) {
    return NextResponse.json({ 
      success: false,
      message: 'Not authenticated' 
    }, { status: 401 });
  }

  const user = session.user;
  const userId = user._id;

  try {
    const foundUser = await UserModel.findById(userId);

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

// Handle POST requests
export async function POST(req: NextRequest) {
  await dbConnect();

  const session = await getServerSession(authOptions );

  if (!session || !session.user) {
    return NextResponse.json({ 
      success: false,
      message: 'Not authenticated' 
    }, { status: 401 });
  }

  const user = session.user;
  const userId = user._id;

  try {
    const { phoneNumber, profilePicture, paymentPreference, paymentId, referralCode }= await req.json();
     

    if (!phoneNumber) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields' 
      }, { status: 400 });
    }
    // const referralCodeGenerator = async () =>  {
    //   const referralCodeGenerated = generateReferralCode(user, userId);
    //   console.log(referralCodeGenerated);
    //   return referralCodeGenerated;
    // }
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      phoneNumber: phoneNumber,
      profilePicture: profilePicture,
      paymentPreference: paymentPreference,
      paymentId: paymentId,
      referralCode: generateReferralCode(user.username,userId)
    }, { new: true });

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'Failed to update user'
      }, { status: 404 });
    }
    console.log(user ,"updated user : ",updatedUser);

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

