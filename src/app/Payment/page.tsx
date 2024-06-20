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
    const fetchTotalAmount = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/payment/totalAmount', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          setTotalAmount(response.data.totalAmount);
        } catch (error) {
          console.error('Error fetching total amount:', error);
        }
      }
    };

    fetchTotalAmount();
  }, [session, status]);

  const handleAccountSetup = async () => {
    try {
      const response = await axios.post('/api/payment/account', { paymentId, payerAccount });
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

    const form = document.createElement('form');
    form.action = 'https://perfectmoney.com/api/step1.asp';
    form.method = 'POST';

    form.innerHTML = `
      <input type="hidden" name="PAYEE_ACCOUNT" value="U46777206">
      <input type="hidden" name="PAYEE_NAME" value="debmalya sen">
      <input type="hidden" name="PAYMENT_ID" value="#deb">
      <input type="hidden" name="PAYMENT_AMOUNT" value="${amount}">
      <input type="hidden" name="PAYMENT_UNITS" value="USD">
      <input type="hidden" name="STATUS_URL" value="mailto:debmalyasen37@gmail.com">
      <input type="hidden" name="PAYMENT_URL" value="http://localhost:3000/payment/success">
      <input type="hidden" name="PAYMENT_URL_METHOD" value="POST">
      <input type="hidden" name="NOPAYMENT_URL" value="http://localhost:3000/payment/unsuccessful">
      <input type="hidden" name="NOPAYMENT_URL_METHOD" value="POST">
      <input type="hidden" name="SUGGESTED_MEMO" value="">
      <input type="hidden" name="username" value="${session.user.name}">
      <input type="hidden" name="Depositwithdraw" value="Deposit">
      <input type="hidden" name="paymentAccount" value="${payerAccount}">
      <input type="hidden" name="transactionid" value="#deb-${Date.now()}">
      <input type="hidden" name="BAGGAGE_FIELDS" value="username Depositwithdraw paymentAccount transactionid">
    `;

    document.body.appendChild(form);
    form.submit();
  };

  const handleWithdraw = async () => {
    try {
      const response = await axios.post('/api/payment/withdraw', { amount }, {
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
            <label className="block text-sm font-medium text-gray-700">Withdraw Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
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
