import React from 'react';

const rules = [
  'Be honest and transparent in your task postings.',
  'No fraudulent or abusive content.',
  'Respect all intellectual property rights.',
  'Do not share personal data without consent.',
  'Abide by our payout and refund policies.',
];

export default function RulesPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Community Rules</h1>
      <ul className="space-y-4">
        {rules.map((rule, i) => (
          <li key={i} className="flex items-start space-x-3">
            <span className="text-green-600 mt-1">•</span>
            <p className="text-gray-700">{rule}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-gray-500">
        These rules are in place to keep our community safe and professional. Violations may lead to account suspension.
      </p>
    </main>
  );
}
