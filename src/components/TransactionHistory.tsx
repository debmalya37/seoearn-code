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
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet.</p>
      ) : (
        <>
          {/* Table view for sm+ */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-left whitespace-nowrap">
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
                    <td className="px-4 py-2 text-sm">${tx.amount.toFixed(2)}</td>
                    <td className="px-4 py-2 text-sm">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile */}
          <div className="space-y-4 sm:hidden">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2"
              >
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(tx.date).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{" "}
                  <span className="capitalize">{tx.type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span> ${tx.amount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> {tx.status}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
