import React from 'react';

interface WalletBalanceProps {
  balance: number;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({ balance }) => {
  return (
    <div className="p-4 border rounded bg-gray-100">
      <h2 className="text-xl font-bold">Balance</h2>
      <p className="text-lg">${balance.toFixed(2)}</p>
    </div>
  );
};

export default WalletBalance;
