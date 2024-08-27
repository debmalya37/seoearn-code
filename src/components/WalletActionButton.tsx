'use client';

import { useState } from 'react';
import PaymentForm from './PaymentForm';

interface WalletActionButtonProps {
  userId: string;
  action: 'deposit' | 'withdraw';
}

const WalletActionButton: React.FC<WalletActionButtonProps> = ({ userId, action }) => {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
  };

  return (
    <div>
      <button onClick={() => setShowForm(!showForm)} className="bg-green-500 text-white p-2">
        {action === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}
      </button>
      {showForm && <PaymentForm userId={userId} action={action} onSuccess={handleSuccess} />}
    </div>
  );
};

export default WalletActionButton;
