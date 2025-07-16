'use client';

import { FaWallet, FaHandHoldingUsd, FaHistory, FaUser, FaCreditCard, FaCog, FaBell, FaStar, FaFileAlt, FaLink, FaTimes, FaBars } from 'react-icons/fa';
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
  const [open, setOpen] = useState(false);
  const [volume, setVolume]     = useState(0);

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

  // fetch total transaction volume on mount & whenever session changes 
  useEffect(() => {
  if (!session?.user?._id) return;
  axios.get('/api/transactions/total')
    .then(res => {
      if (res.data.success) setVolume(res.data.totalValue || 0);
    })
    .catch(console.error);
}, [session]);

  return (
    <>
    {/* Mobile toggle button */}
    <button
    className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow"
    onClick={() => setOpen(o => !o)}
    aria-label={open ? "Close sidebar" : "Open sidebar"}
  >
    {open ? <FaTimes size={20} className='text-black' /> : <FaBars size={20} className='text-black' />}
  </button>

  {/* Sidebar */}
  <div
    className={`
      fixed top-0 left-0 h-screen w-64 bg-gray-200 shadow-md flex flex-col
      transform transition-transform duration-300 z-30 pt-20
      ${open ? 'translate-x-0' : '-translate-x-full'}
      md:translate-x-0 md:relative
    `}
  >
    {/* Wallet Balance */}
    <div className="bg-blue-500 text-white p-4 text-center">
      <h3 className="text-lg font-bold">${balance.toFixed(4)}</h3>
      <p className="text-sm">MY BALANCE</p>
    </div>

    {/* Total Volume */}
      <div className="bg-purple-600 text-white p-4 text-center mt-2">
        <h3 className="text-lg font-bold">${volume.toFixed(2)}</h3>
        <p className="text-sm">TOTAL TRANSACTION VALUE</p>
      </div>

    {/* Revenue Totals */}
    <div className="p-4 space-y-2">
      {/* <div className="bg-green-500 text-white p-3 rounded">
        <h4 className="font-semibold">Seo Earning Space Revenue</h4>
        <p className="text-xl">${totals.totalGross.toFixed(2)}</p>
      </div> */}

      {/* <button
        onClick={refresh}
        disabled={isPending}
        className="mt-2 w-full bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 rounded transition"
      >
        {isPending ? 'Refreshing…' : 'Refresh Revenue'}
      </button> */}
    </div>
  </div>
  </>
  );
};

export default Feedside;
