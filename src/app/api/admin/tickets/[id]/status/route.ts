// pages/api/admin/tickets/[id]/status.ts
import { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '@src/lib/dbConnect';
import Ticket from '@src/models/ticketModel';
import { getSession } from 'next-auth/react';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req });
  if (!session?.user?.isAdmin) return res.status(401).json({ success:false });

  await dbConnect();
  const { id } = req.query as { id: string };
  const { status: newStatus } = req.body as { status: 'open'|'closed' };
  if (!['open','closed'].includes(newStatus)) {
    return res.status(400).json({ success:false, message:'Bad status' });
  }

  const ticket = await Ticket.findByIdAndUpdate(id, { status: newStatus }, { new:true });
  if (!ticket) return res.status(404).json({ success:false, message:'Not found' });

  return res.json({ success:true, ticket });
}
