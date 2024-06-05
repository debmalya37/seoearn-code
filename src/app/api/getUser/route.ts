import { NextApiRequest, NextApiResponse } from 'next';
import UserModel from '@/models/userModel';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  const { email } = req.query;
  const userId = req.query.id;

  const user = await UserModel.find({});

    return res.json(user);


//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     const user = await UserModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json({ user });
//   } catch (error) {
//     console.error('Error retrieving user:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'GET') {
//     return GET(req, res);
//   } else {
//     res.setHeader('Allow', ['GET']);
//     return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
// }
