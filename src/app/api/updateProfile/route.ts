import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '@/models/userModel';
import { getSession } from 'next-auth/react';
import dbConnect from '@/lib/dbConnect';

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { phoneNumber, profilePicture } = req.body;
  if (!phoneNumber) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.phoneNumber = phoneNumber;
    user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    return PATCH(req, res);
  } else {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
