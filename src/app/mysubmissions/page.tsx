// src/app/mysubmissions/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface Submission {
  taskId: string;
  title: string;
  description: string;
  reward: number;
  status: string;
  submittedAt: string;
  fileUrl?: string;
  notes?: string;
}

export default function MySubmissionsPage() {
  const { data: session, status } = useSession();
  const [submissions, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;
    axios.get('/api/my-submissions')
      .then(res => {
        if (res.data.success) setSubs(res.data.submissions);
        else setError(res.data.message || 'Failed to fetch submissions');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  }
  if (status !== 'authenticated') {
    return <div className="min-h-screen flex items-center justify-center">
      <p>You must be logged in to see your submissions.</p>
      <Link href="/sign-in" className="mt-4 px-4 py-2 text-white bg-indigo-600 rounded-lg">Sign In</Link>
    </div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">{error}</div>;
  }
  if (submissions.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">
      You haven’t submitted any tasks yet.
    </div>;
  }

  return (
    <main className="min-h-screen p-4 md:p-8 bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-6 text-gray-800 text-center">My Submissions</h1>
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {submissions.map(s => (
          <div key={`${s.taskId}-${s.submittedAt}`} className="bg-white rounded-xl shadow p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{s.title}</h2>
              <p className="text-gray-600 mt-2 line-clamp-3">{s.description}</p>
              <div className="mt-3 text-sm text-gray-600">
                Reward: <span className="font-medium">${s.reward.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  s.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  s.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {s.status}
                </span>
                <span className="text-xs text-gray-500">{new Date(s.submittedAt).toLocaleDateString()}</span>
              </div>
              {s.notes && (
                <p className="text-sm text-gray-700"><strong>Note:</strong> {s.notes}</p>
              )}
              {s.fileUrl && (
                <a href={s.fileUrl} target="_blank" className="text-indigo-600 hover:underline">
                  View Submission
                </a>
              )}
              <Link
                href={`/TaskFeed/${s.taskId}`}
                className="mt-2 block text-center text-indigo-700 hover:underline"
              >
                View Task Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
