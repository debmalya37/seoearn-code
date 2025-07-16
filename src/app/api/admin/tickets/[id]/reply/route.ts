import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Ticket from '@src/models/ticketModel';
import nodemailer from 'nodemailer';
import { getServerSession } from 'next-auth/next';
import authOptions from '@src/app/api/auth/[...nextauth]/options';
import { Types } from 'mongoose';

// POST /api/admin/tickets/:id/reply
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 });
  }

  await dbConnect();
  const { id } = params;
  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, message: 'Invalid ticket ID' }, { status: 400 });
  }

  const { reply } = await request.json() as { reply: string };
  const ticket = await Ticket.findById(id).populate<{ userId: { email: string } }>('userId', 'email');
  if (!ticket) {
    return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });
  }

  // configure your SMTP transporter here
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to: ticket.userId.email,
    from: process.env.SMTP_USER,
    subject: `Re: [Ticket #${ticket._id}] ${ticket.title}`,
    text: reply,
    html: `<p>${reply.replace(/\n/g, '<br/>')}</p>`,
  });

  // optionally update ticket status or log replies
  ticket.status = 'closed';
  await ticket.save();

  return NextResponse.json({ success: true });
}
