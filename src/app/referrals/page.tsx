"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

function ReferralsPage() {
  const { data: session, status } = useSession();
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referralEarnings, setReferralEarnings] = useState(0);
  const [referredUsernames, setReferredUsernames] = useState<string[]>([]);

  // Static referral list for demo purposes
  const staticReferralList = ["deb", "demo_user", "dbsen"];

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Generate referral code using the email prefix and a static value
      const email = session.user.email;
      const prefix = email.split("@")[0];
      const generatedCode = `${prefix}2023`;
      setReferralCode(generatedCode);
      setReferralLink(`${window.location.origin}/?ref=${generatedCode}`);
    }
  }, [session, status]);

  // For demo purposes, if no referred users / earnings exist, set static values
  useEffect(() => {
    if (referredUsernames.length === 0) {
      setReferredUsernames(staticReferralList);
    }
    if (referralCount === 0) {
      setReferralCount(staticReferralList.length);
    }
    if (referralEarnings === 0) {
      setReferralEarnings(30); // For example, $50 in earnings
    }
  }, [referredUsernames, referralCount, referralEarnings]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    alert("Referral code copied to clipboard!");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Please log in to view your referrals.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Referrals Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Share your referral code or link and earn rewards!
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col items-center bg-blue-100 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Referrals
            </h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {referralCount}
            </p>
          </div>
          <div className="flex flex-col items-center bg-green-100 rounded-lg p-6 shadow-md">
            <h3 className="text-xl font-semibold text-gray-700">
              Total Earnings
            </h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${referralEarnings}
            </p>
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="mb-8 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Referral Code
            </h3>
            <div className="flex items-center mt-2">
              <span className="px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 font-mono rounded-l-md">
                {referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-500 transition-colors"
              >
                Copy Code
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Referral Link
            </h3>
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 bg-gray-100 text-gray-700 rounded-l-md"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-500 transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>

        {/* Referred Users */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
            Referred Users
          </h3>
          {referredUsernames.length > 0 ? (
            <ul className="space-y-3">
              {referredUsernames.map((username, index) => (
                <li
                  key={index}
                  className="p-3 border border-gray-200 rounded shadow-sm hover:shadow-md transition-shadow"
                >
                  {username}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No referred users yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReferralsPage;
