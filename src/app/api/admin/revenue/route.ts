// src/app/api/admin/revenue/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@src/lib/dbConnect';
import { AdsRevenue } from '@src/models/adsRevenueModel';
import UserModel from '@src/models/userModel';

export async function GET() {
  await dbConnect();
  // Pull all ad revenue entries, populate advertiser info
  const list = await AdsRevenue.find()
    .sort({ createdAt: -1 })
    .populate('userId', 'username email')
    .lean();

  // Compute totals
  let totalGross = 0, totalFees = 0, totalNet = 0;
  for (const r of list) {
    totalGross += r.grossBudget;
    totalFees  += r.feeAmount;
    totalNet   += r.netBudget;
  }

   // pre‑format dates exactly as client will:
   const fmt = new Intl.DateTimeFormat('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false
  })
  
  return NextResponse.json({
    success: true,
    totals: { totalGross, totalFees, totalNet },
    list: list.map(r => ({
      id:         r._id,
      userId:     r.userId._id,
      username:   (r.userId as any).username,
      email:      (r.userId as any).email,
      grossBudget:r.grossBudget,
      feeAmount:  r.feeAmount,
      netBudget:  r.netBudget,
      date:       r.createdAt
    }))
  });
}
