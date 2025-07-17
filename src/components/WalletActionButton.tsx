// src/components/WalletActionButton.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@src/components/ui/use-toast';

interface Props {
  action: 'deposit' | 'withdraw';
  userId: string;
  onSuccess: (newBalance: number) => void;
  presetAmount: number;
  className?: string;
}

const SUPPORTED_CURRENCIES = ['USD', 'RUB', 'EUR', 'BTC', 'ETH', 'LTC', 'MATIC'];

export default function WalletActionButton({
  action,
  userId,
  onSuccess,
  presetAmount,
  className,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState<number>(presetAmount);
  const [curIn, setCurIn]   = useState<string>(SUPPORTED_CURRENCIES[0]);
  const [curOut, setCurOut] = useState<string>(SUPPORTED_CURRENCIES[0]);
  const [account, setAccount] = useState<string>('');
  const { toast } = useToast();

  // keep amount in sync with preset buttons
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
        // Create deposit, passing curIn
        const resp = await fetch('/api/wallet/deposit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, amount, currency: curIn }),
        });
        const data = await resp.json();
        if (!data.success) throw new Error(data.message || 'Deposit failed');

        // Build & submit Payeer form
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
        // Withdrawal: always from USD balance → out to curOut
        const res = await fetch('/api/wallet/withdraw', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            usdAmount: amount,       // clearly say “this many USD”
            nativeCurrency: curOut,   // native currency code
            account,
          }),
        });
        const json = await res.json();
        // if (!json.success) throw new Error(json.message);
        if (!json.success) throw new Error(json.message || 'Withdraw failed');

        toast({
          title: 'Withdrawal requested',
          description: 'Admin will process shortly.',
        });

        // Refresh balance
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
      {/* Currency selector */}
      <div className="mb-3">
        <label className="block text-sm font-medium">
          {action === 'deposit' ? 'Pay with' : 'Receive in'}
        </label>
        <select
        title='Select currency for action'
          className="mt-1 w-full p-2 border rounded"
          value={action === 'deposit' ? curIn : curOut}
          onChange={e =>
            action === 'deposit'
              ? setCurIn(e.target.value)
              : setCurOut(e.target.value)
          }
          disabled={loading}
        >
          {SUPPORTED_CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Amount input */}
      <div className="mb-2">
        <label className="block text-sm font-medium">
          {action === 'deposit'
            ? `Amount to deposit (${curIn})`
            : `Amount to withdraw (USD → ${curOut})`}
        </label>
        <input
          type="number"
          step="0.01"
          className="w-full mt-1 p-2 rounded bg-gray-100"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          disabled={loading}
        />
      </div>

      {/* Withdrawal only: account field */}
      {action === 'withdraw' && (
  <>
    {/* Payeer Account Field */}
    {curOut === 'RUB' || curOut === 'USD' ? (
      <div className="mb-4">
        <label className="block text-sm font-medium">Payeer Account</label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded bg-gray-100"
          placeholder="P1234567"
          value={account}
          onChange={(e) => setAccount(e.target.value.trim())}
          disabled={loading}
        />
      </div>
    ) : (
      // Wallet address for crypto like MATIC or LTC
      <div className="mb-4">
        <label className="block text-sm font-medium">
          {curOut} Wallet Address
        </label>
        <input
          type="text"
          className="w-full mt-1 p-2 rounded bg-gray-100"
          placeholder="Enter your wallet address"
          value={account}
          onChange={(e) => setAccount(e.target.value.trim())}
          disabled={loading}
        />
      </div>
    )}
  </>
)}


      {/* Submit */}
      <button
        onClick={handleClick}
        disabled={loading}
        className={`w-full py-2 rounded ${
          loading
            ? 'bg-gray-400'
            : action === 'deposit'
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-yellow-500 hover:bg-yellow-600'
        } text-white transition`}
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