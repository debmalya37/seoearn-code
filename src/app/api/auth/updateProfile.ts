import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '@/models/userModel';
import connectDB from '@/lib/dbConnect';
import { getSession } from 'next-auth/react';

const updateProfile = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { userId, email, username, phoneNumber, gender, age, paymentPreference, paymentGateway, profilePicture } = req.body;

  if (!userId || !email || !username || !phoneNumber || !gender || !age || !paymentPreference || !paymentGateway) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await UserModel.findById(userId);
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
};

export default updateProfile;
