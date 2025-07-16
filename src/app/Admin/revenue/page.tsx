// src/app/admin/revenue/page.tsx"

export const dynamic = 'force-dynamic';
import React from 'react';
import Sidebar from '@src/components/admin/Sidebar';
import AdminRevenueClient from '@src/components/admin/AdminRevenueClient';
// import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface RevenueEntry {
  id: string;
  userId: string;
  username: string;
  email: string;
  grossBudget: number;
  feeAmount: number;
  netBudget: number;
  dateDisplay: string;    // ← pre-formatted
}

interface Totals {
  totalGross: number;
  totalFees: number;
  totalNet: number;
}

async function fetchRevenue() {



  
  const res = await fetch('https://seoearningspace.com/api/admin/revenue', { cache: 'no-store' });
  const { totals, list } = await res.json() as {
    totals: Totals;
    list: Array<{
      id: string;
      userId: string;
      username: string;
      email: string;
      grossBudget: number;
      feeAmount: number;
      netBudget: number;
      date: string; // ISO
    }>;
  };

  // Use a consistent Intl formatter:
  const fmt = new Intl.DateTimeFormat('en-US', {
    month: '2-digit',
    day:   '2-digit',
    year:  'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });

  const formattedList: RevenueEntry[] = list.map(r => ({
    id:         r.id,
    userId:     r.userId,
    username:   r.username,
    email:      r.email,
    grossBudget:r.grossBudget,
    feeAmount:  r.feeAmount,
    netBudget:  r.netBudget,
    dateDisplay: fmt.format(new Date(r.date)),
  }));

  return { totals, list: formattedList };
}

export default async function Page() {


  const { totals, list } = await fetchRevenue();

  
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <AdminRevenueClient initialList={list} initialTotals={totals} />
    </div>
  );
}
