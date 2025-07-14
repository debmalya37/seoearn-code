// src/pages/api/admin/ban-user.ts
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  if (req.method !== 'POST') return res.status(405).end();
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ success: false, message: 'Missing userId' });

  try {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    ).select('email isBlocked');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
}
