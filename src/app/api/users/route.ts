// /app/api/users/createUser.ts

import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';

export async function POST(req: NextRequest) {
  await dbConnect();

  const body = await req.json();

  const { email, phoneNumber } = body;

  // Check if user with the provided email or phone number already exists
  const existingUser = await UserModel.findOne({ $or: [{ email }, { phoneNumber }] });
  if (existingUser) {
    return NextResponse.json({ message: 'User with the provided email or phone number already exists' }, { status: 400 });
  }

  const {  username, password, gender, age, paymentPreference, paymentGateway } = body;

  if (!email || !username || !phoneNumber || !password || !gender || !age || !paymentPreference || !paymentGateway) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
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

    return NextResponse.json({ message: 'User created successfully', user: newUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const GET = async (req: NextRequest) => {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
};

export const PUT = async (req: NextRequest) => {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
};

export const DELETE = async (req: NextRequest) => {
  return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
};

