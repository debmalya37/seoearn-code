// /app/api/users/createUser.ts

import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '@/models/userModel';
import connectDB from '@/lib/dbConnect';

const createUser = async (req: NextApiRequest, res: NextApiResponse) => {
  await connectDB();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, phoneNumber } = req.body;

  // Check if user with the provided email or phone number already exists
  const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingUser) {
    return res.status(400).json({ message: 'User with the provided email or phone number already exists' });
  }

  const { username, password, gender, age, paymentPreference, paymentGateway } = req.body;

  if (!email || !username || !phoneNumber || !password || !gender || !age || !paymentPreference || !paymentGateway) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newUser = new UserModel({
      email,
      username,
      phoneNumber,
      password,
      gender,
      age,
      isVerified: false,
      verifyCode: '123456', // For testing purposes
      verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour from now
      paymentPreference,
      paymentGateway
    });

    await newUser.save();

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default createUser;
