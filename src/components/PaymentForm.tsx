'use client';

import { useState } from 'react';

interface PaymentFormProps {
  action: 'deposit' | 'withdraw';
  onSuccess: (newBalance: number) => void; // Callback to handle balance updates
}

const PaymentForm: React.FC<PaymentFormProps> = ({ action, onSuccess }) => {
  const [amount, setAmount] = useState(0);

  const handleSubmit = async () => {
    const response = await fetch(`/api/wallet/${action}`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      onSuccess(data.balance); // Pass the new balance to the onSuccess callback
    } else {
      const data = await response.json();
      console.error(data.message);
    }
  };

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        className="p-2 border"
      />
      <button onClick={handleSubmit} className="bg-blue-500 text-white p-2">
        {action === 'deposit' ? 'Deposit' : 'Withdraw'}
      </button>
    </div>
  );
};

export default PaymentForm;
