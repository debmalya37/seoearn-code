import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession, User } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/userModel';
import { authOptions } from '../../auth/[...nextauth]/options';

const PERFECT_MONEY_API_URL = 'https://perfectmoney.com/api/step1.asp';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    // Replace with the actual parameters needed for Perfect Money API
    const response = await axios.post(PERFECT_MONEY_API_URL, {
      params: {
        AccountID: 'U46777206',
        PassPhrase: '#deb@perfect#24',
        Payer_Account: '#deb',
      },
    });

    const paymentId = response.data?.PAYMENT_ID;

    if (!paymentId) {
      return NextResponse.json({ message: 'Failed to fetch payment ID' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.paymentId = paymentId;
    await user.save();

    return NextResponse.json({ message: 'Payment ID fetched and stored successfully', paymentId });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
