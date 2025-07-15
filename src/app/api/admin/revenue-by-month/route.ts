// src/app/api/admin/revenue-by-month/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import UserModel from '@src/models/userModel';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function GET(req: NextRequest) {
  // 1. Auth
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  await dbConnect();

  // 2. Unwind all users' transactions, filter to completed, group by year+month
  const results = await UserModel.aggregate([
    // 2a) explode transactions array
    { $unwind: '$transactions' },
    // 2b) only keep completed ones
    { $match: { 'transactions.status': 'completed' } },
    // 2c) group by year & month on transactions.date
    {
      $group: {
        _id: {
          year: { $year: '$transactions.date' },
          month: { $month: '$transactions.date' }
        },
        total: { $sum: '$transactions.amount' }
      }
    },
    // 2d) project into a nicer shape
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        total: 1
      }
    },
    // 2e) sort ascending
    { $sort: { year: 1, month: 1 } }
  ]);

  // 3. Convert to label/value pairs
  const data = results.map(r => ({
    label: `${r.year}-${String(r.month).padStart(2, '0')}`,
    value: r.total
  }));

  return NextResponse.json({ success: true, data });
}
