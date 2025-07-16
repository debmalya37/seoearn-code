// src/components/AdsSide.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FaBars, FaPlus, FaTimes } from 'react-icons/fa';
import { Button } from '@src/components/ui/button';
import axios from 'axios';
import { useToast } from '@src/components/ui/use-toast';
import { useSession } from 'next-auth/react';

export interface AdsSideProps {
  onOpenNewAd: () => void;
}

export default function AdsSide({ onOpenNewAd }: AdsSideProps) {
  const { toast } = useToast();
  const [balance, setBalance] = useState<number | null>(null);
  const [totalBudget, setTotalBudget] = useState<number | null>(null);
  const [activeAds, setActiveAds] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  // const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const {data: session} = useSession();
   // mobile menu open?
   const [open, setOpen] = useState(false);

  const user = session?.user || null;
  console.log("adsside", user);
  // Fetch wallet & ad summary
  useEffect(() => {
    async function load() {
      setLoading(true);

      try {

        const userRes =  await axios.get(`/api/users/${user?._id}`);
        if (userRes.data.success) {
          // alert('User data fetched successfully' + JSON.stringify(userRes.data.user.isBlocked));
          setIsBlocked(!!userRes.data.user.isBlocked);
        }

        // 1) Get wallet balance
        const balRes = await axios.get(`/api/wallet/balance?userId=${user?._id}`);
        if (balRes.data.success) {
          setBalance(balRes.data.balance);
        }

        // 2) Get all ads
        const tasksRes = await axios.get('/api/ownTask');
        if (tasksRes.data.success && Array.isArray(tasksRes.data.tasks)) {
          const tasks = tasksRes.data.tasks as Array<{
            budget: number;
            status: string;
          }>;

          // compute total budget
          const sum = tasks.reduce((acc, t) => acc + (t.budget || 0), 0);
          setTotalBudget(sum);

          // count active ads (not completed)
          const activeCount = tasks.filter(t => t.status !== 'Completed').length;
          setActiveAds(activeCount);
        }
      } catch (err: any) {
        toast({
          title: 'Error loading dashboard',
          description: err.message || 'Something went wrong',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [toast]);

  // shared sidebar content
  const SidebarContent = (
    <>
      <div className="p-6 text-center border-b border-white/20">
        <h2 className="text-2xl font-bold text-blue-600">AdMaster</h2>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-auto">
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-900 uppercase">Balance</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : balance != null ? `$${balance.toFixed(2)}` : '--'}
          </p>
        </div>
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-800 uppercase">Total Budget</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : totalBudget != null ? `$${totalBudget.toFixed(2)}` : '--'}
          </p>
        </div>
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-800 uppercase">Active Ads</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : activeAds != null ? activeAds : '--'}
          </p>
        </div>
      <div className="p-4 border-t border-white/20">
        {isBlocked ? (
          <Button disabled className="w-full flex items-center justify-center space-x-2 bg-gray-500 cursor-not-allowed">
            <FaPlus /> <span>New Ad</span>
          </Button>
        ) : (
          <Button onClick={onOpenNewAd} className="w-full flex items-center justify-center space-x-2 bg-green-500 text-white hover:bg-green-600">
            <FaPlus /> <span>New Ad</span>
          </Button>
        )}
      </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded shadow-lg"
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <FaTimes size={20} className='text-black' /> : <FaBars size={20} className='text-black' />}
      </button>

      {/* Mobile drawer */}
      <aside
        className={`
          md:hidden fixed inset-y-0 left-0 w-64 bg-white/20 backdrop-blur-lg border-r border-white/30 z-40
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {SidebarContent}
      </aside>
      {/* Overlay behind mobile drawer */}
      {open && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setOpen(false)} />}

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:shrink-0 md:w-64 bg-white/20 backdrop-blur-lg border-r border-white/30">
        {SidebarContent}
      </aside>
    </>
  );
}