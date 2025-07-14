import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await UserModel.findOneAndUpdate(
    { email: session.user.email },
    { emailVerificationOTP: otp }
  );

  // Send email (use a real SMTP config in production)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Seo Earning Space" <${process.env.SMTP_EMAIL}>`,
    to: session.user.email,
    subject: "Email Verification OTP",
    html: `<p>Your OTP is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
  });

  return NextResponse.json({ success: true, message: "OTP sent" });
}
