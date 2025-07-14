// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";

export async function POST(request: Request) {
  const { email, otp } = await request.json();
  await dbConnect();
  const user = await UserModel.findOne({ email });
  if (
    !user ||
    user.resetOTP !== otp ||
    !user.resetOTPExpires ||
    user.resetOTPExpires < new Date()
  ) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }
  // clear OTP so it can't be reused
  user.resetOTP = null;
  user.resetOTPExpires = null;
  await user.save();
  return NextResponse.json({ success: true });
}
