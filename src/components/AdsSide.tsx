// src/components/AdsSide.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
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
  // const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const {data: session} = useSession();

  const user = session?.user || null;
  console.log("adsside", user);
  // Fetch wallet & ad summary
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
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

  return (
    <aside className="w-64 bg-white/20 backdrop-blur-lg border-r border-white/30 flex-shrink-0 hidden lg:flex flex-col">
      {/* Logo */}
      <div className="p-6 text-center border-b border-white/20">
        <h2 className="text-2xl font-bold text-blue-600">AdMaster</h2>
      </div>

      {/* Live KPIs */}
      <div className="p-4 space-y-4 flex-1">
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-900 uppercase">Balance</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : balance !== null ? `$${balance.toFixed(2)}` : '--'}
          </p>
        </div>
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-800 uppercase">Total Budget</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : totalBudget !== null ? `$${totalBudget.toFixed(2)}` : '--'}
          </p>
        </div>
        <div className="bg-white/30 p-3 rounded backdrop-blur-sm">
          <h4 className="text-xs text-gray-800 uppercase">Active Ads</h4>
          <p className="text-xl font-semibold">
            {loading ? '…' : activeAds !== null ? activeAds : '--'}
          </p>
        </div>
      </div>

      {/* New Ad Button */}
      <div className="p-4 border-t border-white/20">
        <Button
          onClick={onOpenNewAd}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <FaPlus />
          <span>New Ad</span>
        </Button>
      </div>

      {/* Footer */}
      <div className="p-4 text-xs text-gray-300 border-t border-white/20">
        © 2025 AdMaster Inc.
      </div>
    </aside>
  );
}
