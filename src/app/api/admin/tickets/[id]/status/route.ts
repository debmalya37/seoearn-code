// src/app/api/admin/tickets/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import Ticket from '@src/models/ticketModel';
import { getServerSession } from 'next-auth/next';
import authOptions from '@src/app/api/auth/[...nextauth]/options';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  // 1) Auth check
  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  // 2) Validate
  const { status: newStatus } = await req.json() as { status: 'open'|'closed' };
  if (!['open', 'closed'].includes(newStatus)) {
    return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
  }

  // 3) Update in DB
  await dbConnect();
  const ticket = await Ticket.findByIdAndUpdate(
    params.id,
    { status: newStatus },
    { new: true }
  );
  if (!ticket) {
    return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
  }

  // 4) Return
  return NextResponse.json({ success: true, ticket });
}
