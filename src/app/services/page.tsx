import React from 'react';
import { Icon } from '@iconify/react';

const offerings = [
  {
    icon: 'fa6-solid:bullhorn',
    title: 'Task Promotion',
    description: 'Advertise your micro‑tasks to a global pool of qualified freelancers and get them done fast.',
  },
  {
    icon: 'fa6-solid:clock',
    title: '24/7 Support',
    description: 'Our support team is always on standby to help with any issues or disputes.',
  },
  {
    icon: 'fa6-solid:shield-check',
    title: 'Secure Payments',
    description: 'All transactions are encrypted and escrow‑backed until task completion.',
  },
  {
    icon: 'fa6-solid:chart-line',
    title: 'Analytics Dashboard',
    description: 'Track your spending, earnings, and task performance in real time.',
  },
];

export default function ServicesPage() {
  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6">Our Services</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {offerings.map((svc, i) => (
          <div
            key={i}
            className="flex space-x-4 p-6 border rounded-lg hover:shadow-lg transition"
          >
            <div className="text-green-600 text-3xl">
              <Icon icon={svc.icon} />
            </div>
            <div>
              <h3 className="text-2xl font-semibold">{svc.title}</h3>
              <p className="mt-1 text-gray-700">{svc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
