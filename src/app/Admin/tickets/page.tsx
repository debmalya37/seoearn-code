'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: 'open' | 'closed';
  createdAt: string;
  userId: { username: string; email: string };
}

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();



  
   

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sendingReplyId, setSendingReplyId] = useState<string | null>(null);

  // track per-ticket reply text
  const [replies, setReplies] = useState<Record<string,string>>({});

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user) return;
    fetch('/api/admin/tickets')
      .then(r => r.json())
      .then(j => {
        if (j.success) setTickets(j.tickets);
        else setError(j.message);
      })
      .catch(e => setError(e.message));
  }, [status, session]);

  if (status === 'loading') return <main className="p-6">Loading…</main>;
  if (
    !session ||
     ![ 
      'debmalyasen37@gmail.com',
      'souvik007b@gmail.com',
      'sb@gmail.com',
      'seoearningspace@gmail.com',
      'yashverdhan01@gamil.com',
      'debmalyasen15@gmail.com',
      'test@gmail.com'
    ].includes(session.user!.email!)
  ) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4">Please sign in as an admin to view this dashboard.</p>
          <Link href="/sign-in">
            <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
              Sign In
            </span>
          </Link>
        </div>
      </div>
    );
  }
  if (!session)          return <main className="p-6">Sign in to view tickets.</main>;
//   if (!session.user) return <main className="p-6">Access Denied</main>;

  const handleReplyChange = (id: string, val: string) => {
    setReplies(r => ({ ...r, [id]: val }));
  };

  const sendReply = async (ticket: Ticket) => {
    setSendingReplyId(ticket._id);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply: replies[ticket._id] })
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message);
      alert('Reply sent!');
      setReplies(r => ({ ...r, [ticket._id]: '' }));
    } catch (e: any) {
      alert('Error: ' + e.message);
    } finally {
      setSendingReplyId(null);
    }
  };
  

  const changeStatus = async (ticket: Ticket, newStatus: 'open'|'closed') => {
    try {
      const res = await fetch(`/api/admin/tickets/${ticket._id}/status`, {
        method: 'PATCH',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ status: newStatus })
      });
      const j = await res.json();
      if (!j.success) throw new Error(j.message);
      setTickets(tks => tks.map(t => t._id === ticket._id ? { ...t, status: newStatus } : t));
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">All Support Tickets</h1>
      {error && <div className="bg-red-100 text-red-800 p-4 rounded">{error}</div>}
      {tickets.length === 0 ? (
        <p className="text-gray-600">No tickets found.</p>
      ) : tickets.map(t => (
        <div key={t._id} className="border p-4 rounded space-y-4">
          <header className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">{t.title}</h2>
              <p className="text-sm text-gray-600">
                From {t.userId.username} ({t.userId.email}) —{' '}
                {new Date(t.createdAt).toLocaleString()}
              </p>
            </div>
            <select
            title="Change ticket status"
              value={t.status}
              onChange={e => changeStatus(t, e.target.value as any)}
              className="px-2 py-1 border rounded"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </header>

          <p>{t.description}</p>

          <div className="space-y-2">
            <textarea
              placeholder="Type your reply..."
              value={replies[t._id] || ''}
              onChange={e => handleReplyChange(t._id, e.target.value)}
              className="w-full border p-2 rounded h-24 resize-y"
            />
            <button
  onClick={() => sendReply(t)}
  disabled={
    !replies[t._id]?.trim() ||
    sendingReplyId === t._id ||
    t.status === 'closed' // 🔒 disable if status is closed
  }
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
>
  {sendingReplyId === t._id ? (
    <>
      <svg
        className="animate-spin h-4 w-4 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      Please wait…
    </>
  ) : (
    'Send Reply'
  )}
</button>

          </div>
        </div>
      ))}
    </main>
  );
}
