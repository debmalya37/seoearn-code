"use client";


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import perfectmoneyLogo from "../../../asset/perfectmoney-logo.png";
import payoneerLogo from "../../../asset/payoneer-logo.png";
import paypalLogo from "../../../asset/paypal-logo.jpg";

const PaymentPage: React.FC = () => {
  const { data: session, status } = useSession();
  const [paymentId, setPaymentId] = useState<string>('');
  const [payerAccount, setPayerAccount] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [action, setAction] = useState<string>('deposit');
  const [message, setMessage] = useState<string>('');

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
          console.error("Error fetching total amount:", error);
        }
      }
    };

    fetchTotalAmount();
  }, [session, status]);

  const handleAccountSetup = async () => {
    try {
      const response = await axios.post('/api/payment/account', {
        paymentId,
        payerAccount,
      });
      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  const handlePayment = async () => {
    try {
      const response = await axios.post(`/api/payment/${action}`, {
        amount,
      });
      setMessage(response.data.message);
      setTotalAmount(response.data.totalAmount);
    } catch (error: any) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-pink-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <h2 className="text-xl font-bold mb-5">Payment Gateway</h2>
            <div className="flex items-center mb-5">
              <input type="radio" id="paypal" name="paymentMethod" value="PayPal" className="mr-2" />
              <Image src={paypalLogo} alt="PayPal" width={58} height={34} />
              <input type="radio" id="perfectMoney" name="paymentMethod" value="Perfect Money" className="mr-2 ml-4" checked />
              <Image src={perfectmoneyLogo} alt="Perfect Money" width={58} height={34} />
              <input type="radio" id="payoneer" name="paymentMethod" value="Payoneer" className="mr-2 ml-4" />
              <Image src={payoneerLogo} alt="Payoneer" width={58} height={34} />
            </div>
            <div className="mb-5">
              <label htmlFor="paymentId" className="block mb-2">Payment ID</label>
              <input
                type="text"
                id="paymentId"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="payerAccount" className="block mb-2">Payer Account</label>
              <input
                type="text"
                id="payerAccount"
                value={payerAccount}
                onChange={(e) => setPayerAccount(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>
            <button
              onClick={handleAccountSetup}
              className="bg-pink-500 text-white py-2 px-4 rounded w-full mb-5"
            >
              Save Account Details
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-5">Payment Details</h2>
            <div className="mb-5">
              <label htmlFor="totalMoney" className="block mb-2">Total Money you have</label>
              <input
                type="text"
                id="totalMoney"
                value={totalAmount}
                readOnly
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-5">
              <label htmlFor="depositMoney" className="block mb-2">Deposit Money (minimum amount $20)</label>
              <input
                type="number"
                id="depositMoney"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setAction('deposit');
                }}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-5">
              <label htmlFor="withdrawAmount" className="block mb-2">Withdraw amount</label>
              <input
                type="number"
                id="withdrawAmount"
                value={amount}
                onChange={(e) => {
                  setAmount(Number(e.target.value));
                  setAction('withdraw');
                }}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <button
              onClick={handlePayment}
              className="bg-pink-500 text-white py-2 px-4 rounded w-full"
            >
              {action === 'deposit' ? 'Deposit' : 'Withdraw'}
            </button>
          </div>
        </div>
        {message && (
          <div className="mt-5 p-4 bg-green-100 text-green-700 border border-green-500 rounded">
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
