// src/app/api/profile/kyc-status/route.ts
import { NextResponse } from "next/server";
// import { getServerSession } 
import { authOptions } from "@src/app/api/auth/[...nextauth]/options";
import dbConnect from "@src/lib/dbConnect";
import UserModel from "@src/models/userModel";
import { getServerSession } from "next-auth";


interface User {
    kycStatus?: string;
    kycReviewNotes?: string;
    kycDocuments?: Record<string, unknown>;
    email: string;
  }
  
   
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
  
    await dbConnect();
    const user = await UserModel.findOne<User>({ email: session.user.email })
      .select("kycStatus kycReviewNotes kycDocuments email")
      .lean();
  
    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  
    if (!user) {
      return NextResponse.json({ success: false }, { status: 404 });
    }
  
    return NextResponse.json({
      success: true,
      kycStatus: user.kycStatus || "not_submitted",
      notes: user.kycReviewNotes || "",
      docs: user.kycDocuments || {},
    });
  
  }
