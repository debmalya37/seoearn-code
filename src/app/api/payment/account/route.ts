import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/userModel';
import axios from 'axios';

const VERIFY_URL = 'https://perfectmoney.com/acct/confirm.asp';
const ACCOUNT_ID = process.env.NEXT_PUBLIC_PM_ACCOUNT_ID;
const PASS_PHRASE = process.env.NEXT_PUBLIC_PM_PASSWORD;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { paymentId, payerAccount } = req.body;

    // Verify Perfect Money account
    const verifyResponse = await axios.get(`${VERIFY_URL}?AccountID=${ACCOUNT_ID}&PassPhrase=${PASS_PHRASE}&Payer_Account=${payerAccount}`);
    if (!verifyResponse.data.includes(payerAccount)) {
      return res.status(400).json({ message: 'Invalid Perfect Money account' });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.paymentId = paymentId;
    user.payerAccount = payerAccount;
    await user.save();

    res.status(200).json({ message: 'Account details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
