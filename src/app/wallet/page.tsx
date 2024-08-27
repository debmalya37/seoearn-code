'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PaymentForm from '@src/components/PaymentForm';
import WalletBalance from '@src/components/WalletBalance';
import { useSession } from 'next-auth/react';

const WalletPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const fetchUserProfile = useCallback(async () => {
    if (status === 'loading') return; // Wait for the session to load

    if (!session || !session.user || !session.user.email) {
      console.error('User not authenticated');
      return;
    }

    try {
      const response = await fetch('/api/profile');
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      const data = await response.json();

      if (data.success && data.user) {
        setUserId(data.user._id); // Set the userId from the profile API response
        // Optionally set username or other profile data if needed
        fetchBalance(data.user._id); // Fetch balance with the obtained userId
      } else {
        throw new Error(data.message || 'Failed to fetch user profile');
      }
    } catch (err: any) {
      console.error(err.message);
    }
  }, [session, status]);

  const fetchBalance = async (userId: string) => {
    try {
      const response = await fetch(`/api/wallet/balance?userId=${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch balance: ${response.statusText}`);
      }
      const data = await response.json();
      if (typeof data.balance === 'number') {
        setBalance(data.balance);
      } else {
        throw new Error('Invalid balance data received');
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Your Wallet</h1>
      <WalletBalance balance={balance} />
      <div className="flex gap-4 mt-4">
        <PaymentForm action="deposit" onSuccess={handleBalanceChange} />
        <PaymentForm action="withdraw" onSuccess={handleBalanceChange} />
      </div>
    </div>
  );
};

export default WalletPage;
