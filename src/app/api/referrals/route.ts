import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/options";
import { generateReferralCode, generateReferralLink } from "@/app/utils/referral";
import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

const SECRET_KEY = process.env.JWT_TOKEN || 'your-secret-key';

export async function POST (req: NextRequest) {
  await dbConnect()
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ 
      success: false,
      message: 'Not authenticated' 
    }, { status: 401 });
  }
  const user = session.user;
  const userId = user._Id;

  const foundUser = await UserModel.findOne({userId})

}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user = session?.user;
  const userId = session?.user._id;
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {

    const user = await UserModel.findOne({userId}).populate("referredUsers", "username");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(user.referralCode = "") {
      const referralCode = generateReferralCode(user.username, userId);
      generateReferralLink(referralCode);

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
