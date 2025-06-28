// src/components/WalletActionButton.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@src/components/ui/use-toast';

interface Props {
  action: 'deposit' | 'withdraw';
  userId: string;
  onSuccess: (newBalance: number) => void;
  presetAmount: number;
  currency: string;
  className?: string;
}

export default function WalletActionButton({
  action,
  userId,
  onSuccess,
  presetAmount,
  currency,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(presetAmount);
  const [cntId, setCntId] = useState('');     // For withdraw
  const [account, setAccount] = useState(''); // For withdraw
  const [curOut, setCurOut] = useState(currency);
  const { toast } = useToast();

  // Sync free-form input when preset changes
  useEffect(() => {
    setAmount(presetAmount);
  }, [presetAmount]);

  const handleClick = async () => {
    if (amount <= 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      if (action === 'deposit') {
        const resp = await fetch('/api/wallet/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, currency }),
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Deposit failed');
        window.location.href = data.paymentUrl;
      } else {
        const resp = await fetch('/api/wallet/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, currency: curOut, cntId, account }),
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Withdraw failed');
        toast({ title: 'Withdrawal initiated', description: 'Please check your email for details.' });
        const balRes = await fetch(`/api/wallet/balance?userId=${userId}`);
        const balJson = await balRes.json();
        if (balJson.success) onSuccess(balJson.balance);
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="mb-2">
        <label className="block text-sm font-medium">
          {action === 'deposit' ? 'Amount to deposit' : 'Amount to withdraw'} ({action === 'deposit' ? currency : curOut})
        </label>
        <input
          type="number"
          step="0.01"
          className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          disabled={loading}
        />
      </div>

      {action === 'withdraw' && (
        <>
          <div className="mb-2">
            <label className="block text-sm font-medium">Payout Currency</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
              value={curOut}
              onChange={(e) => setCurOut(e.target.value.toUpperCase())}
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Counterparty ID (cnt_id)</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
              value={cntId}
              onChange={(e) => setCntId(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium">Account</label>
            <input
              type="text"
              className="w-full mt-1 p-2 rounded bg-gray-100 text-black"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              disabled={loading}
            />
          </div>
        </>
      )}

      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-2 rounded ${
          loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'
        } text-black transition`}
      >
        {loading
          ? 'Processing…'
          : action === 'deposit'
          ? 'Proceed to Payeer'
          : 'Request Withdrawal'}
      </button>
    </div>
  );
}
