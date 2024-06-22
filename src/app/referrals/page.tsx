"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

function ReferralsPage() {
  const { data: session, status } = useSession();
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referredUsernames, setReferredUsernames] = useState<string[]>([]);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (status === 'authenticated') {
        try {
          const response = await axios.get('/api/referrals', {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          const data = response.data;

          setReferralCount(data.referralCount);
          setReferralEarnings(data.referralEarnings);
          setReferralCode(data.referralCode);
          setReferralLink(data.referralLink);
          setReferredUsernames(data.referredUsernames || []);
        } catch (error) {
          console.error("Error fetching referral data:", error);
        }
      }
    };

    fetchReferralData();
  }, [session, status]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    alert('Referral code copied to clipboard!');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>Please log in to view your referrals.</div>;
  }

  return (
    <div>
      <h1>Your Referrals</h1>
      <p>Referral Count: {referralCount}</p>
      <p>Referral Earnings: ${referralEarnings}</p>
      <p>
        Your Referral Code: <strong>{referralCode}</strong>
      </p>
      <button onClick={handleCopy}>Copy Referral Code</button>
      <p>
        Your Referral Link: <a href={referralLink}>{referralLink}</a>
      </p>
      <button onClick={handleCopyLink}>Copy Referral Link</button>
      <h2>Referred Users:</h2>
      <ul>
        {referredUsernames.map((username, index) => (
          <li key={index}>{username}</li>
        ))} 
      </ul>
    </div>
  );
}

export default ReferralsPage;
