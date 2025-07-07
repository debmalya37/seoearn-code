'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { CheckCircle, Users, LinkIcon, DollarSign } from 'lucide-react';
import { Tooltip } from '@src/components/ui/tooltip';

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
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReferralData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') fetchReferralData();
    else if (status === 'unauthenticated') setLoading(false);
  }, [status]);

  const fetchReferralData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/referrals');
      const json = await res.json();
      if (json.success) setData(json.data);
      else setError(json.message || 'Failed to load referral data.');
    } catch {
      setError('Server error while fetching referrals.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() =>
      alert('Copied to clipboard!')
    );
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading referral dashboard...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <p className="text-gray-600 dark:text-gray-300">Please login to access your referrals.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800">
        <p className="text-red-500 font-medium">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f9ff] to-white dark:from-gray-900 dark:to-gray-800 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Referral Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-300 mt-2">
            Earn commissions by inviting your friends and colleagues.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard icon={<Users />} label="Direct Referrals" value={data.firstLevelCount} color="indigo" />
          <StatsCard icon={<Users />} label="Indirect Referrals" value={data.secondLevelCount} color="emerald" />
          <StatsCard icon={<DollarSign />} label="Total Earnings" value={`$${data.totalReferralEarnings.toFixed(2)}`} color="yellow" />
          <StatsCard icon={<CheckCircle />} label="Your Code" value={data.referralCode} color="blue" copy={() => copyToClipboard(data.referralCode)} />
        </div>

        {/* Referral Link */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
          <h2 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200 flex items-center gap-2">
            <LinkIcon className="w-5 h-5" />
            Your Referral Link
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              readOnly
              value={data.referralLink}
              className="w-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md font-mono"
            />
            <button
              onClick={() => copyToClipboard(data.referralLink)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Direct Referrals List */}
        <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">Your Direct Referrals</h2>
          {data.firstLevelReferrals.length > 0 ? (
            <ul className="divide-y divide-gray-200 dark:divide-gray-600">
              {data.firstLevelReferrals.map((ref, idx) => (
                <li key={idx} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      {ref.username}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {ref.email}
                    </p>
                  </div>
                  <p className="text-sm text-indigo-600 dark:text-indigo-300">
                    Referral Count: <strong>{ref.referralCount}</strong>
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">You haven’t referred anyone yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({
  icon,
  label,
  value,
  color,
  copy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: 'indigo' | 'emerald' | 'yellow' | 'blue';
  copy?: () => void;
}) {
  return (
    <div
      className={`rounded-xl bg-${color}-100 dark:bg-${color}-900 p-5 shadow hover:shadow-lg transition cursor-default flex flex-col justify-between`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-full bg-${color}-200 dark:bg-${color}-800 text-${color}-800 dark:text-${color}-100`}>
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{label}</h3>
      </div>
      <div className="flex items-center justify-between">
        <p className={`text-3xl font-bold text-${color}-700 dark:text-${color}-200`}>{value}</p>
        {copy && (
          <button
            onClick={copy}
            className="text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            Copy
          </button>
        )}
      </div>
    </div>
  );
}
