
export const dynamic = 'force-dynamic';
import React, { useEffect, useState } from 'react';
import { Button } from '@src/components/ui/button';
import { useToast } from '@src/components/ui/use-toast';
import Link from 'next/link';


interface Withdrawal {
  userId: string;
  status: string;
  userName: string;
  userEmail: string;
  txnId: string;
  amount: number;
  details?: {
    cntId?: string;
    account?: string;
    curOut?: string;
  };
  date: string;
}

export default function AdminWithdrawPage() {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { toast } = useToast();


  // const { data: session } = useSession();
  
  //   if (
  // //     !session ||
  //  //    ![ 
  //       'debmalyasen37@gmail.com',
  //       'souvik007b@gmail.com',
  //       'sb@gmail.com',
  //       'seoearningspace@gmail.com',
  //       'yashverdhan01@gamil.com',
  //       'debmalyasen15@gmail.com',
  //       'test@gmail.com'
  //     ].includes(session.user!.email!)
  //   ) {
  //     return (
  //       <div className="flex justify-center items-center h-full">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold">Access Denied</h1>
  //           <p className="mt-4">Please sign in as an admin to view this dashboard.</p>
  //           <Link href="/sign-in">
  //             <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
  //               Sign In
  //             </span>
  //           </Link>
  //         </div>
  //       </div>
  //     );
  //   }

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/withdrawals', { cache: 'no-store' });
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
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
        <p className="text-gray-600">No withdrawal requests found.</p>
      ) : (
        <div className="space-y-4">
          {withdrawals.map((w) => {
            const isProcessed = w.status === 'approved' || w.status === 'rejected';
            const details = w.details || {};
            return (
              <div
                key={w.txnId}
                className="bg-white rounded-lg shadow-sm p-5 flex flex-col md:flex-row md:items-center md:justify-between hover:shadow-md transition"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {w.userName}{' '}
                        <span className="text-sm text-gray-500">({w.userEmail})</span>
                      </h2>
                      <p className="text-sm text-gray-500">
                        {new Date(w.date).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(w.status)}`}>
                      {w.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-gray-700 mb-3">
                    <p><strong>Amount:</strong> {w.amount} {details.curOut || 'N/A'}</p>
                    <p><strong>Txn ID:</strong> {w.txnId}</p>
                    <p><strong>Account:</strong> {details.account || 'N/A'}</p>
                    <p><strong>Cnt ID:</strong> {details.cntId || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 mt-4 md:mt-0 md:ml-6">
  {w.status === 'processing' && (
    <>
      {/* <input
        type="checkbox"
        checked={selected.has(w.txnId)}
        onChange={() => toggleSelection(w.txnId)}
        className="w-4 h-4 border-gray-300 text-green-600 focus:ring-green-500"
      /> */}
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
    </>
  )}
</div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
