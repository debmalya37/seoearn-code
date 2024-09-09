'use client';

import React, { useState, useEffect, useCallback } from 'react';
import WalletActionButton from '@src/components/WalletActionButton'; // Updated import
import WalletBalance from '@src/components/WalletBalance';
import TransactionHistory from '@src/components/TransactionHistory';
import { useSession } from 'next-auth/react';

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
}

const WalletPage = () => {
  const [balance, setBalance] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const { data: session, status } = useSession();

  const fetchUserProfile = useCallback(async () => {
    if (status === 'loading') return; // Wait for session to load

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
        setUserId(data.user._id); // Set userId from profile API response
        fetchBalance(data.user._id); // Fetch balance using userId
        fetchTransactions(data.user._id); // Fetch transactions using userId
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

  const fetchTransactions = async (userId: string) => {
    try {
      const response = await fetch(`/api/wallet/transaction?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.transactions);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleBalanceChange = (newBalance: number) => {
    setBalance(newBalance);
    if (userId) {
      // Fetch the transactions again after deposit/withdraw
      fetchTransactions(userId);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Your Wallet</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet balance */}
        <WalletBalance balance={balance} />

        {/* Deposit and Withdraw buttons using WalletActionButton */}
        {userId && (
          <>
            <WalletActionButton
              action="deposit"
              userId={userId}
              onSuccess={handleBalanceChange} // Pass onSuccess callback
            />
            <WalletActionButton
              action="withdraw"
              userId={userId}
              onSuccess={handleBalanceChange} // Pass onSuccess callback
            />
          </>
        )}

        {/* Transaction history */}
        <TransactionHistory transactions={transactions} className="mt-8" />
      </div>
    </div>
  );
};

export default WalletPage;
