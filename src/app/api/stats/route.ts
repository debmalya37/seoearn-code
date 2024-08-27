import { NextResponse } from "next/server";
import User from "@src/models/userModel";
import dbConnect from "@src/lib/dbConnect";
import Task from "@src/models/taskModel";

export async function GET() {
  try {
    await dbConnect();

    const userList = await User.find({}, 'username email gender age isVerified');
    
    
    const response = NextResponse.json({
      userStats: { userList }
    });
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats', details: error }, { status: 500 });
  }
}

// Fetch task stats (if needed)
// const totalTasks = await Task.countDocuments({});
// const taskList = await Task.find({}, 'title description rating category createdAt createdBy status is18Plus');
// Set cache control headers to prevent caching
// Fetch user stats