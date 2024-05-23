import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '@/models/userModel';
import connectDB from '@/lib/dbConnect';

const getUser = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default getUser;
