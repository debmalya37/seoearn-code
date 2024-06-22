import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/userModel';
import { transferFunds } from '@/lib/perfectMoney';

const MY_PAYMENT_ID = process.env.NEXT_PUBLIC_PM_USD_ACCOUNT  || "U46777206"; // Your Perfect Money account ID for USD

export default async function post(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { amount } = req.body;
    if (amount < 25) {
      return res.status(400).json({ message: 'Minimum withdraw amount is $25' });
    }

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.totalAmount < amount) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    const paymentId = `${user._id}-${Date.now()}`;

    // Transfer funds from your Perfect Money account to user's account
    const transferResponse = await transferFunds(MY_PAYMENT_ID, user.payerAccount, amount, paymentId);

    if (!transferResponse.PAYMENT_BATCH_NUM) {
      throw new Error('Failed to transfer funds');
    }

    user.totalAmount -= amount;
    await user.save();

    res.status(200).json({ message: 'Withdrawal successful', totalAmount: user.totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
}
