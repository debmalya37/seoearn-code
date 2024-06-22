"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

function PaymentPage() {
  const { data: session, status } = useSession();
  const [paymentId, setPaymentId] = useState('');
  const [payerAccount, setPayerAccount] = useState('');
  const [amount, setAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchPaymentData = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/payment/totalAmount', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`,
            },
          });
          const data = response.data;
          setTotalAmount(data.totalAmount);
          setPaymentId(data.paymentId);
          setPayerAccount(data.payerAccount);
        } catch (error) {
          console.error("Error fetching payment data:", error);
        }
      }
    };
    fetchPaymentData();
  }, [session, status]);

  const handleAccountSetup = async () => {
    try {
      const response = await axios.post('/api/PaymentAccount', { paymentId, payerAccount }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating account details:', error);
    }
  };

  const handleDeposit = async () => {
    if (amount < 20) {
      alert('Minimum deposit amount is $20');
      return;
    }

    try {
      const response = await axios.post('/api/deposit', { amount }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      alert(response.data.message);
      setTotalAmount(response.data.totalAmount);
    } catch (error) {
      console.error('Error during deposit:', error);
    }
  };

  const handleWithdraw = async () => {
    if (amount < 25) {
      alert('Minimum withdraw amount is $25');
      return;
    }

    try {
      const response = await axios.post('/api/withdraw', { amount }, {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`
        }
      });
      alert(response.data.message);
      setTotalAmount(response.data.totalAmount);
    } catch (error) {
      console.error('Error during withdrawal:', error);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please log in to proceed with payments.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payment ID</label>
            <input
              type="text"
              value={paymentId}
              onChange={(e) => setPaymentId(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Payer Account</label>
            <input
              type="text"
              value={payerAccount}
              onChange={(e) => setPayerAccount(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={handleAccountSetup}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Account Details
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Total Money you have</label>
            <input
              type="text"
              value={totalAmount}
              readOnly
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Deposit Money (Minimum $20)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="20"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={handleDeposit}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Deposit
          </button>
          <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700">Withdraw Amount (Minimum $25)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              min="25"
              className="mt-1 p-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <button
            onClick={handleWithdraw}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Withdraw
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;
