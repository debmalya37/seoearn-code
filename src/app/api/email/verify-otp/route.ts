import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const { otp } = await req.json();
  const user = await UserModel.findOne({ email: session.user.email });

  if (!user || user.emailVerificationOTP !== otp) {
    return NextResponse.json({ success: false, message: "Invalid OTP" }, { status: 400 });
  }

  user.isEmailVerified = true;
  user.emailVerificationOTP = null;
  await user.save();

  return NextResponse.json({ success: true, message: "Email verified" });
}
