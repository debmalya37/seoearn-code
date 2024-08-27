import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import User from '@src/models/userModel';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@src/app/api/auth/[...nextauth]/options'; // Ensure this is correctly configured

export async function GET(request: NextRequest) {
  await dbConnect();

  // Retrieve the session
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get the user's email from the session
  const userEmail = session.user.email;

  // Find the user in the database by email
  const user = await User.findOne({ email: userEmail });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ balance: user.balance });
}
