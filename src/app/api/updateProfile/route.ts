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

  const { email, username, phoneNumber, gender, age, paymentPreference, paymentGateway, profilePicture } = req.body;

  if (!email || !username || !phoneNumber || !gender || !age || !paymentPreference || !paymentGateway) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.email = email;
    user.username = username;
    user.phoneNumber = phoneNumber;
    user.gender = gender;
    user.age = age;
    user.paymentPreference = paymentPreference;
    user.paymentGateway = paymentGateway;
    user.profilePicture = profilePicture;

    await user.save();

    return res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await UserModel.findOne({ email: session.user.email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
