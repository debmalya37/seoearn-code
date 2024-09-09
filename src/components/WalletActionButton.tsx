'use client';

import { useState } from 'react';
import PaymentForm from './PaymentForm';

interface WalletActionButtonProps {
  userId: string;
  action: 'deposit' | 'withdraw';
  onSuccess: (newBalance: number) => void; // Add onSuccess to props
}

const WalletActionButton: React.FC<WalletActionButtonProps> = ({ userId, action, onSuccess }) => {
  const [showForm, setShowForm] = useState(false);

  const handleSuccess = (newBalance: number) => {
    setShowForm(false); // Close the form upon success
    onSuccess(newBalance); // Call the onSuccess callback
  };

  // Set button color and label based on action
  const buttonStyles = action === 'deposit' ? 'bg-green-500' : 'bg-red-500';
  const buttonLabel = action === 'deposit' ? 'Deposit Money' : 'Withdraw Money';

  return (
    <div>
      <button
        onClick={() => setShowForm(!showForm)}
        className={`${buttonStyles} text-white p-2`}
      >
        {buttonLabel}
      </button>
      {/* Show form only if showForm is true */}
      {showForm && <PaymentForm userId={userId} action={action} onSuccess={handleSuccess} />}
    </div>
  );
};

export default WalletActionButton;
