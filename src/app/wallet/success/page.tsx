// src/app/wallet/success/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@src/components/ui/use-toast';

export default function SuccessPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const confirmDeposit = async () => {
      // Grab all payeer params out of URL
      const params = Object.fromEntries(new URLSearchParams(window.location.search));
      try {
        const res = await fetch('/api/wallet/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
        });
        const text = await res.text();
        if (res.ok) {
          toast({ title: '✅ Deposit credited!', variant: 'default' });
        } else {
          toast({ title: '⚠️ Deposit confirmation failed', description: text, variant: 'destructive' });
        }
      } catch (err: any) {
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
      } finally {
        setProcessing(false);
      }
    };

    confirmDeposit();
  }, [toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow text-center space-y-4">
        <h1 className="text-2xl font-bold text-green-600">
          {processing ? 'Finalizing your deposit…' : 'Payment Successful'}
        </h1>
        <p className="text-gray-700">
          {processing
            ? 'Please wait while we credit your wallet…'
            : 'Thank you! Your deposit has been added to your wallet.'}
        </p>
        {!processing && (
          <button
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={() => router.push('/wallet')}
          >
            Go to My Wallet
          </button>
        )}
      </div>
    </div>
  );
}
