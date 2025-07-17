// src/components/TransactionHistory.tsx
'use client';

interface Props {
  transactions: Array<{
    id: string;
    type: 'deposit' | 'withdrawal';
    date: string;
    status: string;
    nativeAmount: number;
    nativeCurrency: string;
    usdAmount: number;
  }>;
}

export default function TransactionHistory({ transactions }: Props) {
  return (
    <div className="bg-gray-200 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-400">No transactions yet.</p>
      ) : (
        <>
          {/* Desktop table */}
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
                  <tr key={tx.id} className="border-t border-gray-300">
                    <td className="px-4 py-2 text-sm">
                      {new Date(tx.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm capitalize">{tx.type}</td>
                    <td className="px-4 py-2 text-sm">
                      {tx.nativeAmount.toFixed(2)} {tx.nativeCurrency}
                      {' '}(&approx; ${tx.usdAmount.toFixed(2)})
                    </td>
                    <td className="px-4 py-2 text-sm">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-4 sm:hidden">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-lg shadow flex flex-col space-y-2"
              >
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(tx.date).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Type:</span>{' '}
                  <span className="capitalize">{tx.type}</span>
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Amount:</span>{' '}
                  {tx.nativeAmount.toFixed(2)} {tx.nativeCurrency}{' '}
                  <em>(≈${tx.usdAmount.toFixed(2)})</em>
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
