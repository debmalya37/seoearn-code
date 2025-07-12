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

  // Keep inputs in sync with presets / currency select
  useEffect(() => {
    setAmount(presetAmount);
    setCurOut(currency);
  }, [presetAmount, currency]);

  const handleClick = async () => {
    if (amount <= 0) {
      toast({ title: 'Invalid amount', variant: 'destructive' });
      return;
    }
    setLoading(true);

    try {
      if (action === 'deposit') {
        // 1) Create deposit, get form data for Payeer
        const resp = await fetch('/api/wallet/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, currency }),
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Deposit failed');

        // 2) Build & submit a hidden form to Payeer
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.url;
        form.style.display = 'none';
        Object.entries(data.fields).forEach(([name, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = name;
          input.value = String(value);
          form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
      } else {
        // Withdrawal request: record in our system
        // Withdrawal request
        // Withdrawal request: record in our system
        const res = await fetch('/api/wallet/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            amount,
            account,
            currency,   // we'll treat this as both curIn & curOut
          }),
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message || `Withdraw failed ${json.errorCode || json.error || json}`);

        toast({ title: 'Withdrawal requested', description: 'Admin will process shortly.' });

        // Refresh the user’s balance
        const balRes  = await fetch(`/api/wallet/balance?userId=${userId}`);
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
      {/* Amount Input */}
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

      {/* Withdraw‑only fields */}
      {action === 'withdraw' && (
        <div className="mb-4">
          <label className="block text-sm font-medium">Payeer Account</label>
          <input
            type="text"
            className="w-full mt-1 p-2 rounded bg-gray-100"
            placeholder="P1234567"
            value={account}
            onChange={e => setAccount(e.target.value.trim())}
            disabled={loading}
          />
        </div>
      )}


      {/* Submit Button */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-2 rounded ${loading ? 'bg-gray-400' : 'bg-yellow-500 hover:bg-yellow-600'} text-black transition`}
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
