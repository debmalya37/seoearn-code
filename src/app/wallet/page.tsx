// src/app/wallet/page.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import WalletActionButton from '@src/components/WalletActionButton';
import WalletBalance from '@src/components/WalletBalance';
import TransactionHistory from '@src/components/TransactionHistory';
import { useSession } from 'next-auth/react';

const CURRENCIES = ['USD', 'EUR', 'RUB', 'INR'];
const PRESET_AMOUNTS = [10, 20, 50, 100];

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [presetAmount, setPresetAmount] = useState<number | null>(null);
  const { data: session, status } = useSession();

  const fetchUserProfile = useCallback(async () => {
    if (status === 'loading') return;
    if (!session?.user?.email) return;
    const res = await fetch('/api/profile');
    const data = await res.json();
    if (data.success) {
      setUserId(data.user._id);
      await fetchBalance(data.user._id);
      await fetchTransactions(data.user._id);
    }
  }, [session, status]);

  const fetchBalance = async (uid: string) => {
    const res = await fetch(`/api/wallet/balance?userId=${uid}`);
    const data = await res.json();
    if (data.success) setBalance(data.balance);
  };

  const fetchTransactions = async (uid: string) => {
    const res = await fetch(`/api/wallet/transaction?userId=${uid}`);
    const data = await res.json();
    if (data.success) setTransactions(data.transactions);
  };

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleBalanceChange = async () => {
    if (userId) {
      await fetchBalance(userId);
      await fetchTransactions(userId);
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading…</div>;
  }
  if (!session?.user) {
    return <div className="p-8 text-center">Please log in to access your wallet.</div>;
  }

  return (
    <div className="min-h-screen bg-green-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6 text-center border-b border-yellow-500 pb-2">
        Your Wallet
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Balance */}
        <WalletBalance balance={balance} />

        {/* Deposit Section */}
        <section className="bg-white text-black rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Deposit Funds</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setPresetAmount(amt)}
                className={`px-4 py-2 rounded ${
                  presetAmount === amt
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="currency" className="font-medium">Currency:</label>
            <select
              id="currency"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="p-2 rounded bg-gray-100 text-black"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <WalletActionButton
            action="deposit"
            userId={userId!}
            onSuccess={handleBalanceChange}
            presetAmount={presetAmount ?? 0}
            currency={selectedCurrency}
          />
        </section>

        {/* Withdraw Section */}
        <section className="bg-white text-black rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Withdraw Funds</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setPresetAmount(amt)}
                className={`px-4 py-2 rounded ${
                  presetAmount === amt
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4 mb-4">
            <label htmlFor="currency-out" className="font-medium">Currency:</label>
            <select
              id="currency-out"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="p-2 rounded bg-gray-100 text-black"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <WalletActionButton
            action="withdraw"
            userId={userId!}
            onSuccess={handleBalanceChange}
            presetAmount={presetAmount ?? 0}
            currency={selectedCurrency}
          />
        </section>

        {/* Transaction History */}
        <section className="bg-white text-black rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionHistory transactions={transactions} />
        </section>
      </div>
    </div>
  );
}
