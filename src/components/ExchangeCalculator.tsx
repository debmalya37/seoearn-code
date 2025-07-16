// src/components/ExchangeCalculator.tsx
'use client';

import React, { useState } from 'react';

const SUPPORTED = ['EUR','GBP','INR','RUB','JPY','CAD','AUD'];

export default function ExchangeCalculator() {
  const [from, setFrom] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(0);
  const [result, setResult] = useState<number|null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const convert = async () => {
    setError(null);
    if (amount <= 0) {
      setError('Enter a positive amount');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const json = await res.json();
  
      if (json.result === 'success' && json.rates && json.rates.USD) {
        const usdValue = json.rates.USD * amount;
        setResult(usdValue);
      } else {
        throw new Error('Conversion failed or currency not supported');
      }
    } catch (e: any) {
      setError(e.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Convert to USD</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div>
          <label className="block text-sm font-medium">Currency</label>
          <select
          title='Select currency to convert from'
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="mt-1 w-full p-2 border rounded"
          >
            {SUPPORTED.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={e => setAmount(parseFloat(e.target.value))}
            className="mt-1 w-full p-2 border rounded"
          />
        </div>
        <div>
          <button
            onClick={convert}
            disabled={loading}
            className={`w-full py-2 rounded text-white ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '…' : 'Convert'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
      {result !== null && !error && (
        <p className="mt-4 text-lg">
          {amount.toFixed(2)} {from} ≈ <strong>${result.toFixed(2)}</strong> USD
        </p>
      )}
    </div>
  );
}
