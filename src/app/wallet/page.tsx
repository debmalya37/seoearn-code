'use client';

import React, { useState, useEffect, useCallback } from 'react';
import WalletActionButton from '@src/components/WalletActionButton';
import WalletBalance from '@src/components/WalletBalance';
import TransactionHistory from '@src/components/TransactionHistory';
import { useSession } from 'next-auth/react';
import { WalletIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';
import ExchangeCalculator from '@src/components/ExchangeCalculator';

const CURRENCIES = ['USD'];
const PRESET_AMOUNTS = [10, 20, 50, 100];

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [presetAmount, setPresetAmount] = useState<number | null>(null);
  const { data: session, status } = useSession();

  const fetchUserProfile = useCallback(async () => {
    if (status === 'loading' || !session?.user?.email) return;
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

  if (status === 'loading') return <div className="text-center mt-20">Loading your wallet...</div>;
  if (!session?.user) return <div className="text-center mt-20">Please log in to access your wallet.</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 text-gray-800">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-green-800 mb-1">My Wallet</h1>
          <p className="text-gray-600">Securely manage your funds with instant deposits and tracked withdrawals.</p>
        </div>
        {/* Exchange Calculator */}
        <ExchangeCalculator />

        {/* Balance Card */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WalletIcon className="w-10 h-10 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Current Balance</p>
              <p className="text-2xl font-bold text-gray-900">${balance.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={handleBalanceChange}
            className="text-sm text-green-700 hover:underline"
          >
            Refresh
          </button>
        </div>

        {/* Deposit Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Deposit Funds</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setPresetAmount(amt)}
                className={`py-2 rounded-md font-medium border ${
                  presetAmount === amt
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select
            title="Select currency for deposit"
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="p-2 border rounded-md w-full bg-gray-50"
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
        </div>

        {/* Withdraw Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpTrayIcon className="w-6 h-6 text-yellow-600" />
            <h2 className="text-xl font-semibold">Withdraw Funds</h2>
          </div>
          <p className="text-sm text-gray-600 mb-4">Withdrawals are manually reviewed before processing.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setPresetAmount(amt)}
                className={`py-2 rounded-md font-medium border ${
                  presetAmount === amt
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border-gray-200'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>
          <WalletActionButton
            action="withdraw"
            userId={userId!}
            onSuccess={handleBalanceChange}
            presetAmount={presetAmount ?? 0}
            currency={selectedCurrency}
          />
        </div>

        {/* Transaction History */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  );
}
