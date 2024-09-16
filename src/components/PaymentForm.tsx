'use client';

import { useState } from 'react';

interface PaymentFormProps {
  userId: string;
  action: 'deposit' | 'withdraw';
  onSuccess: (newBalance: number) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ userId, action, onSuccess }) => {
  const [amount, setAmount] = useState<number>(0);
  const [accountNumber, setAccountNumber] = useState<string>(''); // for withdraw

  const handleSubmit = async () => {
    const body = action === 'withdraw' ? { amount, userId, accountNumber } : { amount, userId };

    const response = await fetch(`/api/wallet/${action}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const data = await response.json();
      if (action === 'deposit') {
        // Redirect to Payeer payment page for deposit
        window.location.href = data.redirectURL;
      } else {
        onSuccess(data.balance); // Update balance after withdrawal
      }
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
        className="p-2 border rounded w-full mb-2"
      />
      {action === 'withdraw' && (
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          placeholder="Enter Payeer account number"
          className="p-2 border rounded w-full mb-2"
        />
      )}
      <button onClick={handleSubmit} className={`bg-${action === 'deposit' ? 'blue' : 'red'}-500 text-white p-2 rounded w-full`}>
        {action === 'deposit' ? 'Deposit' : 'Withdraw'}
      </button>
    </div>
  );
};

export default PaymentForm;
