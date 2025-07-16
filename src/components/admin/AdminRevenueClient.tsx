// src/components/admin/AdminRevenueClient.tsx
'use client';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useState, useTransition } from 'react';

interface Entry {
  id: string;
  userId: string;
  username: string;
  email: string;
  grossBudget: number;
  feeAmount: number;
  netBudget: number;
  dateDisplay: string;  // already formatted
}

interface Totals {
  totalGross: number;
  totalFees: number;
  totalNet: number;
}

export default function AdminRevenueClient({
  initialList,
  initialTotals,
}: {
  initialList: Entry[];
  initialTotals: Totals;
}) {
  const [list, setList]     = useState<Entry[]>(initialList);
  const [totals, setTotals] = useState<Totals>(initialTotals);
  const [isPending, start]  = useTransition();
  const { data: session } = useSession();

  const refresh = () => {
    start(async () => {
      const res = await fetch('/api/admin/revenue');
      const { totals, list } = await res.json();

      // Re‐use the same formatting logic on the client (or just call back to the server component!)
    //   const fmt = new Intl.DateTimeFormat('en-US', {
    //     month: '2-digit',
    //     day:   '2-digit',
    //     year:  'numeric',
    //     hour:   '2-digit',
    //     minute: '2-digit',
    //     second: '2-digit',
    //     hour12: false
    //   });

      setTotals(totals);
      setList(list.map((r: any) => ({
        ...r,
        dateDisplay: (new Date(r.date).toLocaleDateString()),
      })));
    });
  };

 
  
    if (
      !session ||
       ![ 
        'debmalyasen37@gmail.com',
        'souvik007b@gmail.com',
        'sb@gmail.com',
        'seoearningspace@gmail.com',
        'yashverdhan01@gamil.com',
        'debmalyasen15@gmail.com',
        'test@gmail.com'
      ].includes(session.user!.email!)
    ) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="mt-4">Please sign in as an admin to view this dashboard.</p>
            <Link href="/sign-in">
              <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                Sign In
              </span>
            </Link>
          </div>
        </div>
      );
    }


  return (
    <main className="flex-1 p-6 bg-gray-50">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ad Revenue Dashboard</h1>
        <button
          onClick={refresh}
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Refreshing…' : 'Refresh'}
        </button>
      </header>

      <section className="grid grid-cols-3 gap-4 mb-6">
        <Card label="Total Gross" value={`$${totals.totalGross.toFixed(2)}`} color="bg-green-100" />
        <Card label="Total Fees"  value={`$${totals.totalFees .toFixed(2)}`} color="bg-red-100"   />
        <Card label="Total Net"   value={`$${totals.totalNet  .toFixed(2)}`} color="bg-blue-100"  />
      </section>

      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['User','Email','Gross','Fee','Net','Date'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-semibold text-gray-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {list.map(row => (
              <tr key={row.id}>
                <td className="px-4 py-2">{row.username}</td>
                <td className="px-4 py-2">{row.email}</td>
                <td className="px-4 py-2">${row.grossBudget.toFixed(2)}</td>
                <td className="px-4 py-2">${row.feeAmount  .toFixed(2)}</td>
                <td className="px-4 py-2">${row.netBudget  .toFixed(2)}</td>
                <td className="px-4 py-2">{row.dateDisplay}</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-4 text-center text-gray-500">
                  No ad revenue recorded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

function Card({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className={`${color} p-4 rounded shadow`}>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );
}
