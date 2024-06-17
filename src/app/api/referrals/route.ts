import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const SECRET_KEY = process.env.JWT_TOKEN || 'your-secret-key';
const session = await getServerSession(authOptions);
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();

  
  const user: User = session?.user as User;

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);

    const user = await UserModel.findOne({ _id: decoded.userId }).populate("referredUsers", "username");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const referredUsernames = user.referredUsers.map((user: any) => user.username);

    return res.status(200).json({
      referralCount: user.referralCount,
      referralEarnings: user.referralEarnings,
      referralCode: user.referralCode,
      referredUsernames: referredUsernames,
    });
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
