'use client';
import { useEffect, useState } from 'react';

export default function MyTicketsPage() {
  interface Ticket {
    _id: string;
    title: string;
    createdAt: string;
    description: string;
    status: string;
  }

  const [tickets, setTickets] = useState<Ticket[]>([]);
  useEffect(() => {
    fetch('/api/tickets')
      .then(r => r.json())
      .then(j => { if (j.success) setTickets(j.tickets); });
  }, []);

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
      {tickets.map(t => (
        <div key={t._id} className="border p-4 rounded mb-2">
          <h2 className="font-semibold">{t.title}</h2>
          <p className="text-sm text-gray-600">{new Date(t.createdAt).toLocaleString()}</p>
          <p className="mt-2">{t.description}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 rounded">{t.status}</span>
        </div>
      ))}
    </main>
  );
}
