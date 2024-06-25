"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { generateReferralCode, generateReferralLink } from '../utils/referral';

interface Referral {
  name: string;
  email: string;
}

interface ReferralData {
  totalReferrals: number;
  referralList: Referral[];
  referralCode: string;
}

const ReferralPage = () => {
  const { data: session, status } = useSession();
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (session) {
        setLoading(true);
        try {
          const response = await axios.get('/api/referrals');
          if (response.status === 200) {
            setReferralData(response.data.referralStats);
          } else {
            setError('Failed to fetch referral data');
          }
        } catch (error) {
          console.error('Error fetching referral data:', error);
          setError('Failed to fetch referral data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReferralData();
  }, [session]);

  const referralCodeGeneration = async ()=> {
    const response = await axios.get('/api/profile');
    const user = response.data.user;
    const userId = response.data.userId;
    const referralCode = generateReferralCode(user,userId);
    // setValue('referralCode',user.referralCode)
    return referralCode;
    
  }

  const copyReferralLink = () => {
    if (referralData?.referralCode) {
      const referralLink = generateReferralLink(referralData.referralCode);
      navigator.clipboard.writeText(referralLink).then(
        () => setSuccess('Referral link copied to clipboard'),
        () => setError('Failed to copy referral link')
      );
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your referrals.</p>;
  }

  return (
    <div className="flex flex-col items-center mt-0 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400">
      <div className="bg-gradient-to-r from-pink-100 via-orange-200 to-pink-300 rounded-lg shadow-2xl p-8 w-full max-w-4xl mt-10 mb-5">
        <h1 className="text-3xl font-bold mb-8 text-center">Referral Dashboard</h1>
        {loading ? (
          <p>Loading referral data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : referralData ? (
          <>
            <div className="bg-white shadow-md rounded p-4 mb-4">
              <h2 className="text-xl font-semibold mb-2">Total Referrals: {referralData.totalReferrals}</h2>
            </div>
            <div className="bg-white shadow-md rounded p-4">
              <h2 className="text-xl font-semibold mb-2">Referred Users</h2>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b border-gray-200">Name</th>
                    <th className="py-2 px-4 border-b border-gray-200">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {referralData.referralList.map((referral, index) => (
                    <tr key={index}>
                      <td className="py-2 px-4 border-b border-gray-200">{referral.name}</td>
                      <td className="py-2 px-4 border-b border-gray-200">{referral.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-center mt-6">
              <p className="text-gray-800 mb-2">Referral Link:</p>
              <div className="flex items-center">
              <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  value={`${window.location.origin}/sign-up?ref=${referralCode}`}
                  readOnly
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
                >
                  Copy
                </button>
              </div>
            </div>
          </>
        ) : (
          <p>No referral data available.</p>
        )}
        {success && <div className="text-green-500 text-center mt-4">{success}</div>}
      </div>
    </div>
  );
};

export default ReferralPage;
