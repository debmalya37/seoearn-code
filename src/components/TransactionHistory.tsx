// src/components/TransactionHistory.tsx
'use client';

interface Props {
  transactions: {
    id: string;
    amount: number;
    type: 'deposit' | 'withdrawal';
    date: string;
    status: string;
  }[];
}

export default function TransactionHistory({ transactions }: Props) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet.</p>
      ) : (
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-t border-gray-700">
                <td className="px-4 py-2 text-sm">{new Date(tx.date).toLocaleString()}</td>
                <td className="px-4 py-2 text-sm capitalize">{tx.type}</td>
                <td className="px-4 py-2 text-sm">{tx.amount.toFixed(2)}</td>
                <td className="px-4 py-2 text-sm">{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
