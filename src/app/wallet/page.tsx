'use client';

import React, { useState, useEffect, useCallback } from 'react';
import PaymentForm from '@src/components/PaymentForm';
import WalletBalance from '@src/components/WalletBalance';

const WalletPage = () => {
  const [balance, setBalance] = useState<number>(0); // Initialize balance state
  const userId = "exampleUserId"; // Replace with actual user ID

  const fetchBalance = useCallback(async () => {
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
  }, [userId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const handleBalanceChange = async (newBalance: number) => {
    setBalance(newBalance);
    // Optionally, you could refresh the balance from the server
    // await fetchBalance();
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
