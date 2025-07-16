import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import Ticket from '@src/models/ticketModel';
import authOptions from '../auth/[...nextauth]/options';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }
  const { title, description } = await req.json();
  if (!title || !description) {
    return NextResponse.json({ success: false, message: 'Missing fields' }, { status: 400 });
  }
  await dbConnect();
  const ticket = await Ticket.create({
    title,
    description,
    userId: session.user._id,
  });
  return NextResponse.json({ success: true, ticket }, { status: 201 });
}


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
    }
    await dbConnect();
    const tickets = await Ticket.find({ userId: session.user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tickets });
  }
  