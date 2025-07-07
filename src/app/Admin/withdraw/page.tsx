'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@src/components/ui/button';
import { useToast } from '@src/components/ui/use-toast';

interface Withdrawal {
  userId: string;
  status: string;
  userName: string;
  userEmail: string;
  txnId: string;
  amount: number;
  details: { cntId: string; account: string; curOut: string };
  date: string;
}

export default function AdminWithdrawPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdrawals');
      const json = await res.json();
      if (json.success) {
        setWithdrawals(json.withdrawals);
      } else {
        toast({ title: 'Error', description: json.message, variant: 'destructive' });
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const toggleSelection = (txnId: string) => {
    const updated = new Set(selected);
    if (updated.has(txnId)) updated.delete(txnId);
    else updated.add(txnId);
    setSelected(updated);
  };

  const handleBulkPayout = async () => {
    if (selected.size === 0) return;
    try {
      const res = await fetch('/api/admin/withdrawals/payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txnIds: Array.from(selected) }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast({ title: 'Success', description: `${json.paid} payouts processed.` });
      setSelected(new Set());
      fetchWithdrawals();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  const handleAction = async (txnId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch(`/api/admin/withdrawals/${txnId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      toast({ title: `Withdrawal ${action}`, description: json.message });
      await fetchWithdrawals();
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="p-6 md:p-10 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Withdrawal Requests</h1>
        {selected.size > 0 && (
          <Button onClick={handleBulkPayout} className="bg-green-600 hover:bg-green-700 text-white">
            Payout Selected ({selected.size})
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading withdrawal requests...</p>
      ) : withdrawals.length === 0 ? (
        <p className="text-gray-600">No pending withdrawal requests.</p>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((w) => (
            <div
              key={w.txnId}
              className="bg-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {w.userName} <span className="text-sm text-gray-500">({w.userEmail})</span>
                    </h2>
                    <p className="text-sm text-gray-500">
                      {new Date(w.date).toLocaleString()}
                    </p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium">
                    {w.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-700 mb-3">
                  <p><strong>Amount:</strong> {w.amount} {w.details.curOut}</p>
                  <p><strong>Txn ID:</strong> {w.txnId}</p>
                  <p><strong>Account:</strong> {w.details.account}</p>
                  <p><strong>Cnt ID:</strong> {w.details.cntId}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
                <input
                  type="checkbox"
                  checked={selected.has(w.txnId)}
                  onChange={() => toggleSelection(w.txnId)}
                  className="w-4 h-4 border-gray-300 text-green-600 focus:ring-green-500"
                />
                <Button
                  onClick={() => handleAction(w.txnId, 'approve')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleAction(w.txnId, 'reject')}
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
