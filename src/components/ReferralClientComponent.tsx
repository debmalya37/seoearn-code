'use client';

import React from 'react';
import 'tailwindcss/tailwind.css';

interface Referral {
  name: string;
  email: string;
}

interface ReferralClientComponentProps {
  referralData: {
    totalReferrals: number;
    referralList: Referral[];
  };
}

const ReferralClientComponent: React.FC<ReferralClientComponentProps> = ({ referralData }) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Referral Dashboard</h1>
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
    </div>
  );
};

export default ReferralClientComponent;
