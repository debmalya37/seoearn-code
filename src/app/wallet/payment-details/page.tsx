'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@src/components/ui/use-toast';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface BankAccount {
  _id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifsc?: string;
  routingNumber?: string;
  verified: boolean;
}

export default function PaymentDetailsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [form, setForm] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifsc: '',
    routingNumber: '',
  });
  const [verif, setVerif] = useState({ accountId: '', code: '' });

  // Fetch existing accounts
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch('/api/wallet/accounts')
      .then((res) => res.json())
      .then((data) => data.success && setAccounts(data.accounts))
      .catch((e) => console.error(e));
  }, [session]);

  // Add account
  const addAccount = async () => {
    const res = await fetch('/api/wallet/link-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'Verification code sent to your email' });
      setAccounts((prev) => [...prev, data.account]);
    } else {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  };

  // Confirm account
  const confirmAccount = async () => {
    const res = await fetch('/api/wallet/confirm-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verif),
    });
    const data = await res.json();
    if (data.success) {
      toast({ title: 'Account verified!' });
      setAccounts((prev) =>
        prev.map((acc) =>
          acc._id === verif.accountId ? { ...acc, verified: true } : acc
        )
      );
    } else {
      toast({ title: 'Error', description: data.message, variant: 'destructive' });
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Bank / Payment Accounts</h1>
      <div className="space-y-6">
        {/* List existing */}
        {accounts.map((acc) => (
          <div
            key={acc._id}
            className="p-4 bg-white rounded shadow flex justify-between items-center"
          >
            <div>
              <p>{acc.bankName} - {acc.accountNumber}</p>
              <p className="text-sm">{acc.verified ? 'Verified' : 'Unverified'}</p>
            </div>
            {!acc.verified && (
              <Link
                href="#verify"
                className="text-blue-600 hover:underline"
                onClick={() => setVerif({ ...verif, accountId: acc._id })}
              >
                Verify
              </Link>
            )}
          </div>
        ))}

        {/* Add new */}
        <div className="p-6 bg-white rounded shadow space-y-4">
          <h2 className="text-lg font-semibold">Link a New Account</h2>
          <input
            placeholder="Bank Name"
            className="w-full p-2 border rounded"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
          />
          <input
            placeholder="Account Holder Name"
            className="w-full p-2 border rounded"
            value={form.accountHolderName}
            onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
          />
          <input
            placeholder="Account Number"
            className="w-full p-2 border rounded"
            value={form.accountNumber}
            onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
          />
          <input
            placeholder="IFSC (India) / Routing Number (US)"
            className="w-full p-2 border rounded"
            value={form.ifsc}
            onChange={(e) => setForm({ ...form, ifsc: e.target.value })}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={addAccount}
          >
            Link Account
          </button>
        </div>

        {/* Verification */}
        {verif.accountId && (
          <div id="verify" className="p-6 bg-white rounded shadow space-y-4">
            <h2 className="text-lg font-semibold">Verify Account</h2>
            <input
              placeholder="Enter code from email"
              className="w-full p-2 border rounded"
              value={verif.code}
              onChange={(e) => setVerif({ ...verif, code: e.target.value })}
            />
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={confirmAccount}
            >
              Confirm
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
