// src/app/Admin/Users/actions.ts
import { getServerSession } from 'next-auth/next';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options';

export async function fetchUsers() {
  await dbConnect();
  try {
    const users = await User.find({}, 'username name email age gender isVerified').exec();
    // Convert MongoDB ObjectIds to strings
    return users.map(user => ({
      _id: user._id.toString(),
      username: user.username,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      isVerified: user.isVerified
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
