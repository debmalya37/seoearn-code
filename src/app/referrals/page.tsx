// src/app/Referral/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

interface ReferralData {
  referralCode: string;
  referralLink: string;
  firstLevelCount: number;
  secondLevelCount: number;
  totalReferralEarnings: number;
  firstLevelReferrals: Array<{
    username: string;
    email: string;
    referralCount: number;
  }>;
}

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch referral dashboard on mount
  useEffect(() => {
    if (status === 'authenticated') {
      fetchReferralData();
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status]);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/referrals');
      const json = await res.json();
      if (res.ok && json.success) {
        setData(json.data);
      } else {
        setError(json.message || 'Failed to load referral data.');
      }
    } catch (err) {
      console.error(err);
      setError('Server error while fetching referrals.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading your referrals…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">
          You must log in to view your referrals.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">
            Your Referral Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Earn 10% from direct referrals, 5% from indirect referrals.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-indigo-100 dark:bg-indigo-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold text-indigo-800 dark:text-indigo-100">
              Direct Referrals
            </h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-200">
              {data.firstLevelCount}
            </p>
          </div>
          <div className="bg-green-100 dark:bg-green-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-100">
              Indirect Referrals
            </h3>
            <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-200">
              {data.secondLevelCount}
            </p>
          </div>
          <div className="bg-yellow-100 dark:bg-yellow-900 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold text-yellow-800 dark:text-yellow-100">
              Total Earnings
            </h3>
            <p className="mt-2 text-3xl font-bold text-yellow-700 dark:text-yellow-200">
              ${data.totalReferralEarnings.toFixed(2)}
            </p>
          </div>
          <div className="bg-indigo-50 dark:bg-indigo-800 rounded-xl p-6 shadow-lg flex flex-col items-center">
            <h3 className="text-xl font-semibold text-indigo-700 dark:text-indigo-100">
              Your Code & Link
            </h3>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <span className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono rounded-l-md">
                {data.referralCode}
              </span>
              <button
                onClick={() => copyToClipboard(data.referralCode)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md transition-colors"
              >
                Copy Code
              </button>
            </div>
            <div className="mt-3 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                readOnly
                value={data.referralLink}
                className="w-full px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-l-md"
              />
              <button
                onClick={() => copyToClipboard(data.referralLink)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-md transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* List of Direct Referrals */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            People You Referred
          </h2>
          {data.firstLevelReferrals.length > 0 ? (
            <ul className="space-y-4">
              {data.firstLevelReferrals.map((user, idx) => (
                <li
                  key={idx}
                  className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.email}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Their Direct Count:
                    </p>
                    <p className="text-xl font-semibold text-indigo-600 dark:text-indigo-300">
                      {user.referralCount}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              You haven’t referred anyone yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
