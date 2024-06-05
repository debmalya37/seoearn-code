// import { NextRequest, NextResponse } from 'next/server';
// import UserModel from '@/models/userModel';
// import dbConnect from '@/lib/dbConnect';
// import { IUser } from '@/models/userModel';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]/options';

import { NextApiRequest, NextApiResponse } from 'next';
import UserModel, { IUser } from '@/models/userModel';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import { getServerSession, User } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { toast } from '@/components/ui/use-toast';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User


  if (!session || !session.user) {

    return res.status(401).json({ 
      success: false,
      message: 'not authenticated' 
      
    });
  }


  const userId = user._id
   
  const { phoneNumber, profilePicture } = await req.body();
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId,
      {phoneNumber: phoneNumber, profilePicture: profilePicture },
      {new: true}
      )
    if (!updatedUser) {
      toast({
        title: "User Not Found",
        description: "Failed to Update user status",
        variant: 'destructive'
      })
      return res.status(401).json({
        success: false,
        message: 'Failed to Update user status' });
    }
    await updatedUser.save();
    toast({
      title: "User Updated successfully",
      description: "user has been successfully updated",
      variant: 'default'
    })
    return res.json({
      success: true,
      message: "Updated User successfully",
      updatedUser
    }
      )

  } catch (error) {
    console.error('Error updating profile:', error);
    toast({
      title: "Error updating profile",
      description: "failed to update user status",
      variant: 'destructive'
    })
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'PATCH') {
//     return POST(req, res);
//   } else {
//     res.setHeader('Allow', ['POST']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
//   }
// }



export async function GET(req: NextRequest) {
  
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user as User


  if (!session || !session.user) {

    return NextResponse.json({ 
      success: false,
      message: 'not authenticated' 
      
    },
    {
      status: 200
    });
  }


  const userId = user._id

  try {
    const foundUser = await UserModel.findById(userId);

    if(!foundUser) {
      return NextResponse.json(
        {
          success: false,
          message: "failed to find user",
          foundUser
        },
        {
          status: 401
        }

      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "user data fetching successful"
      },
      {
        status: 200
      }
    )
    // const token = req.headers.get('authorization');
    // const userId = await UserModel.findById(session.user._id) as IUser; // Adjust `decodeToken` based on your token logic

    // if (userId) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // const user = await UserModel.findById(userId).populate('referredBy', 'username email');

    // if (!user) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 404 });
    // }

    // return NextResponse.json({ data: user });
  } catch (error: any) {
    console.log("failed to find user data", error);
    return NextResponse.json({ error: 'error in getting user data' }, { status: 500 });
  }
}


