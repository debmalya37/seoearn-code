import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/userModel';
import axios from 'axios';
import { authOptions } from '../../auth/[...nextauth]/options';

const VERIFY_URL = 'https://perfectmoney.com/acct/confirm.asp';
const ACCOUNT_ID = process.env.NEXT_PUBLIC_PM_ACCOUNT_ID;
const PASS_PHRASE = process.env.NEXT_PUBLIC_PM_PASSWORD;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();

  try {
    const { paymentId, payerAccount } = await req.json();

    // Verify Perfect Money account
    const verifyResponse = await axios.get(`${VERIFY_URL}?AccountID=${ACCOUNT_ID}&PassPhrase=${PASS_PHRASE}&Payer_Account=${payerAccount}`);
    if (!verifyResponse.data.includes(payerAccount)) {
      return NextResponse.json({ message: 'Invalid Perfect Money account' }, { status: 400 });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.paymentId = paymentId;
    user.payerAccount = payerAccount;
    await user.save();

    return NextResponse.json({ message: 'Account details updated successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}

export const runtime = "edge";

export default POST;
