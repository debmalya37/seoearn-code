import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@src/lib/dbConnect';
import Ticket from '@src/models/ticketModel';
import authOptions from '../../auth/[...nextauth]/options';
// import authOptions from '../auth/[...nextauth]/options';


export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    // YOUR admin check here, e.g. session.user.isAdmin
    if (!session?.user) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }
    await dbConnect();
    const tickets = await Ticket.find().populate('userId','email username').sort({ createdAt: -1 });
    return NextResponse.json({ success: true, tickets });
  }
  