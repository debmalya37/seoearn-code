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
    const { paymentId, payerAccount } = req.body;

    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.paymentId = paymentId;
    user.payerAccount = payerAccount;
    await user.save();

    res.status(200).json({ message: 'Account details updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
