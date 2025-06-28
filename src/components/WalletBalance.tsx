// src/components/WalletBalance.tsx
'use client';

export default function WalletBalance({ balance }: { balance: number }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold">Current Balance</h2>
      <p className="text-4xl font-bold mt-2">{balance.toFixed(2)}</p>
    </div>
  );
}
