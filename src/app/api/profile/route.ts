import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';
import { IUser } from '@/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';




export async function GET(req: NextRequest) {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  try {
    await dbConnect();
    const token = req.headers.get('authorization');
    const userId = await UserModel.findById(session.user._id) as IUser; // Adjust `decodeToken` based on your token logic

    if (userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await UserModel.findById(userId).populate('referredBy', 'username email');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


