'use client';

import React, { useEffect, useState } from 'react';

interface TransactionHistoryProps {
  userId: string | null;
  className?: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'deposit' | 'withdraw';
  date: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId, className }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!userId) return;

    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/wallet/transaction?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions);
      } catch (err: any) {
        console.error(err.message);
      }
    };

    fetchTransactions();
  }, [userId]);

  return (
    <div className={`p-6 bg-white shadow-lg rounded-lg ${className}`}>
      <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
      <ul>
        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions available.</p>
        ) : (
          transactions.map((transaction) => (
            <li key={transaction.id} className="mb-4">
              <div className="flex justify-between">
                <span className={transaction.type === 'deposit' ? 'text-green-500' : 'text-red-500'}>
                  {transaction.type === 'deposit' ? 'Deposit' : 'Withdraw'}: ${transaction.amount.toFixed(2)}
                </span>
                <span className="text-gray-500">{new Date(transaction.date).toLocaleDateString()}</span>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TransactionHistory;
