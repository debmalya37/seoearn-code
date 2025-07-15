'use client';

import { FaWallet, FaHandHoldingUsd, FaHistory, FaUser, FaCreditCard, FaCog, FaBell, FaStar, FaFileAlt, FaLink } from 'react-icons/fa';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Totals {
  totalGross: number;
  totalFees: number;
  totalNet: number;
}

const Feedside = ({
  initialTotals,
}: {
  initialTotals: Totals;
}) => {
  const { data: session } = useSession();
  const [balance, setBalance] = useState<number>(0);
  const [totals, setTotals] = useState<Totals>(initialTotals);
  const [isPending, start] = useTransition();

  // fetch revenue totals from your API
  const refresh = () => {
    start(async () => {
      try {
        const res = await fetch('/api/admin/revenue');
        const { totals } = await res.json();
        setTotals(totals);
      } catch (err) {
        console.error('Error fetching revenue totals:', err);
      }
    });
  };

  // load on mount
  useEffect(() => {
    refresh();
  }, []);

  // fetch wallet balance
  useEffect(() => {
    async function loadWallet() {
      if (!session?.user?._id) return;
      try {
        const res = await axios.get(`/api/wallet/balance?userId=${session.user._id}`);
        if (res.data.success) {
          setBalance(res.data.balance || 0);
        }
      } catch (err) {
        console.error('Error fetching wallet balance:', err);
      }
    }
    loadWallet();
  }, [session]);

  return (
    <div className="h-screen w-64 bg-gray-200 shadow-md flex flex-col">
      {/* Wallet Balance */}
      <div className="bg-blue-500 text-white p-4 text-center">
        <h3 className="text-lg font-bold">${balance.toFixed(4)}</h3>
        <p className="text-sm">MY BALANCE</p>
      </div>

      {/* Revenue Totals */}
      <div className="p-4 space-y-2">
        <div className="bg-green-500 text-white p-3 rounded">
          <h4 className="font-semibold">Seo Earning Space Revenue</h4>
          <p className="text-xl">${totals.totalGross.toFixed(2)}</p>
        </div>
        {/* <div className="bg-yellow-500 text-white p-3 rounded">
          <h4 className="font-semibold">Total Fees</h4>
          <p className="text-xl">${totals.totalFees.toFixed(2)}</p>
        </div>
        <div className="bg-indigo-500 text-white p-3 rounded">
          <h4 className="font-semibold">Net Revenue</h4>
          <p className="text-xl">${totals.totalNet.toFixed(2)}</p>
        </div> */}

        {/* Optional: manual refresh button */}
        <button
          onClick={refresh}
          disabled={isPending}
          className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 rounded transition"
        >
          {isPending ? 'Refreshing…' : 'Refresh Revenue'}
        </button>
      </div>

      {/* …anything else you want in your sidebar… */}
    </div>
  );
};

export default Feedside;
