import UserModel from "@src/models/userModel";
import dbConnect from "@src/lib/dbConnect";
import { NextResponse } from "next/server";
import { Types } from "mongoose";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { success: false, message: "Invalid user id" },
      { status: 400 }
    );
  }

  try {
    const user = await UserModel.findById(id).select("email");
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, email: user.email },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching user" },
      { status: 500 }
    );
  }
}
