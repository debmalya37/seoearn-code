"use client";

import React, { useState } from 'react';
import axios from 'axios';

const PaymentPage: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [memo, setMemo] = useState<string>('');
  const [payerAccount, setPayerAccount] = useState<string>('');
  const [payeeAccount, setPayeeAccount] = useState<string>('');
  const [action, setAction] = useState<string>('deposit');
  const [message, setMessage] = useState<string>('');

  const handlePayment = async () => {
    try {
      const response = await axios.post(`/api/${action}`, {
        accountId: process.env.NEXT_PUBLIC_ACCOUNT_ID,
        passPhrase: process.env.NEXT_PUBLIC_PASS_PHRASE,
        payerAccount,
        payeeAccount,
        amount,
        memo,
      });

      setMessage(response.data);
    } catch (error: any) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div>
      <h1>{action === 'deposit' ? 'Deposit Money' : 'Withdraw Money'}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePayment();
        }}
      >
        <div>
          <label>
            Payer Account:
            <input
              type="text"
              value={payerAccount}
              onChange={(e) => setPayerAccount(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Payee Account:
            <input
              type="text"
              value={payeeAccount}
              onChange={(e) => setPayeeAccount(e.target.value)}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Amount:
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Memo:
            <input
              type="text"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
            />
          </label>
        </div>
        <div>
          <button type="submit">{action === 'deposit' ? 'Deposit' : 'Withdraw'}</button>
        </div>
      </form>
      <button onClick={() => setAction('deposit')}>Deposit</button>
      <button onClick={() => setAction('withdraw')}>Withdraw</button>
      <p>{message}</p>
    </div>
  );
};

export default PaymentPage;
