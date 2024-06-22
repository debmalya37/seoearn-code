import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/userModel';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  await dbConnect();

  try {
    const { amount } = req.body;
    const processingFee = 5; // Example processing fee
    const totalDeduction = amount + processingFee;

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.totalAmount < totalDeduction) {
      return res.status(400).json({ message: 'Insufficient funds' });
    }

    user.totalAmount -= totalDeduction;
    await user.save();

    res.status(200).json({ message: 'Withdrawal successful', totalAmount: user.totalAmount });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
