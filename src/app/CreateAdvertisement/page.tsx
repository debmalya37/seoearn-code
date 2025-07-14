// src/app/createadvertisement/page.tsx
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import Link from 'next/link';
import { useToast } from '@src/components/ui/use-toast';
import AdsSide from '@src/components/AdsSide';
import AddTaskModal from '@src/components/AddTaskModal';
import { Button } from '@src/components/ui/button';
import { ApiResponse } from '@src/types/ApiResponse';
import { ITask } from '@src/models/taskModel';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';

interface SimpleTask {
  _id: string;
  title: string;
  category: string;
  reward: number;
  budget: number;
  status: string;
  createdAt: Date;
}

interface Submission {
  _id: string;
  userId: string;          // original ID        // fetched
  email: string;           // fetched
  status: string;
  message?: string;
  fileUrl?: string;
  createdAt: Date;
  rejectionReason?: string;
  avgRating?: number; // fetched
  ratingCount?: number; // fetched
}

type Tab = 'all' | 'inProgress';

export default function CreateAdvertisement() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [tasks, setTasks] = useState<SimpleTask[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<SimpleTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const router = useRouter();

  const user = session?.user || null;
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
    // new: for rejection dialog
    const [rejectingId, setRejectingId] = useState<string | null>(null);
    const [reasonText, setReasonText] = useState('');
    // inside CreateAdvertisement()
const [starRating, setStarRating] = useState<Record<string,number>>({});



useEffect(() => {
  async function checkBlock() {
    if (!session?.user?.email) return;

    try {
      const userRes =  await axios.get(`/api/users/${user?._id}`);
      if (userRes.data.success) {
        // alert('User data fetched successfully' + JSON.stringify(userRes.data.user.isBlocked));
        setIsBlocked(!!userRes.data.user.isBlocked);
      }

      if(userRes.data.user.isBlocked) {
        router.push('/contact');
      }
      if(userRes.data.user.isHidden) {
        router.push('/Profile');
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
    }
  }

  checkBlock();
}, [session]);

  // Fetch ads
  const fetchTasks = useCallback(async (notify = false) => {
    setLoading(true);
    try {
      const s = await getSession();
      const { data } = await axios.get<ApiResponse>('/api/ownTask', {
        headers: { Authorization: `Bearer ${s?.accessToken}` },
      });
      const raw: ITask[] = data.tasks || [];
      const mapped = raw.map(t => ({
        _id: t._id!.toString(),
        title: t.title,
        category: t.category,
        reward: t.reward,
        budget: t.budget,
        status: t.status,
        createdAt: t.createdAt || new Date(),
      }));
      setTasks(mapped);
      setInProgressTasks(mapped.filter(t => t.status === 'In Progress'));
      if (notify) toast({ title: 'Ads refreshed' });
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Fetch & populate submissions + user info
  const loadSubmissions = useCallback(async (taskId: string) => {
    try {
      const { data: taskData } = await axios.get(`/api/tasks/${taskId}`);
      if (!taskData.success) {
        throw new Error(taskData.message || 'Failed to load submissions');
      }

      const rawSubs = taskData.task.requests as Array<{
        _id: string;
        userId: string;
        status: string;
        message?: string;
        fileUrl?: string;
        createdAt: string;
        rejectionReason?: string;
      }>;

      // Batch‐fetch user info
      const enriched: Submission[] = await Promise.all(
        rawSubs.map(async sub => {
          const { data: userData } = await axios.get(`/api/users/${sub.userId}`);
          // userData should contain { success: true, user: { username, email } }
          return {
            _id: sub._id,
            userId: sub.userId,
            email: userData.user.email,
            status: sub.status,
            message: sub.message,
            fileUrl: sub.fileUrl,
            createdAt: new Date(sub.createdAt),
            avgRating: userData.user.rating?.average || 0,
            ratingCount: userData.user.rating?.count || 0,
            rejectionReason: sub.rejectionReason, // ← grab it
          };
        })
      );

      setSubmissions(enriched);
    } catch (e: any) {
      toast({ title: 'Error loading submissions', description: e.message, variant: 'destructive' });
    }
  }, [toast]);

  // On task selection
  useEffect(() => {
    if (selectedTaskId) loadSubmissions(selectedTaskId);
    else setSubmissions([]);
  }, [selectedTaskId, loadSubmissions]);

  // Initial load
  useEffect(() => {
    if (session?.user) fetchTasks(true);
  }, [session, fetchTasks]);

  // Approve / reject
  const handleSubmission = async (submissionId: string, newStatus: 'approved'|'rejected') => {
    if (!selectedTaskId) return;
    try {
      const { data } = await axios.put(`/api/tasks/${selectedTaskId}`, {
        status: newStatus,
        submissionId,
      });
      if (data.success) {
        toast({ title: 'Success', description: `Submission ${newStatus}` });
        loadSubmissions(selectedTaskId);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  // Approve handler
  const handleApprove = async (submissionId: string) => {
    if (!selectedTaskId) return;
    try {
      const { data } = await axios.put(`/api/tasks/${selectedTaskId}`, {
        status: 'approved',
        submissionId
      });
      if (data.success) {
        toast({ title: 'Approved', description: 'Submission approved' });
        loadSubmissions(selectedTaskId);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };

  // Reject handler (after entering reason)
  const submitRejection = async () => {
    if (!selectedTaskId || !rejectingId) return;
    try {
      const { data } = await axios.put(`/api/tasks/${selectedTaskId}`, {
        status: 'rejected',
        submissionId: rejectingId,
        rejectionReason: reasonText.trim(), // ← corrected
      });
      if (data.success) {
        toast({ title: 'Rejected', description: 'Submission rejected' });
        setRejectingId(null);
        loadSubmissions(selectedTaskId);
      }
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    }
  };


  if (!session?.user) {
    return <Link href="/sign-in">Please sign in</Link>;
  }

  const displayTasks = activeTab === 'all' ? tasks : inProgressTasks;

  return (
    <div className="flex h-screen bg-gray-100">
      <AdsSide onOpenNewAd={() => setIsAddModalOpen(true)} />

      <main className="flex-1 overflow-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Hello, {session.user.username}</h1>
          <Button onClick={() => fetchTasks(true)}>Refresh</Button>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-xs text-gray-500 uppercase">Total Ads</h4>
            <p className="text-2xl font-semibold">{tasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-xs text-gray-500 uppercase">In Progress</h4>
            <p className="text-2xl font-semibold">{inProgressTasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-xs text-gray-500 uppercase">Completed</h4>
            <p className="text-2xl font-semibold">
              {tasks.filter(t => t.status === 'Completed').length}
            </p>
          </div>
        </section>

        {/* Tabs */}
        <nav className="flex space-x-4 border-b mb-6">
          {(['all','inProgress'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 ${
                activeTab === tab
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'all' ? 'All Ads' : 'In Progress'}
            </button>
          ))}
        </nav>

        {/* Ads Table */}
        <section className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title','Category','Reward','Budget','Status','','Created',''].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {displayTasks.map(t => (
                <tr key={t._id}>
                  <td className="px-6 py-4">
                    <Link href={`/ads/${t._id}`} className="text-blue-600 hover:underline">
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{t.category}</td>
                  <td className="px-6 py-4">${t.reward}</td>
                  <td className="px-6 py-4">${t.budget}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      t.status === 'Completed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>{t.status}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button size="sm" onClick={() => setSelectedTaskId(t._id)}>
                      View Subs
                    </Button>
                  </td>
                  <td className="px-6 py-4">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}
              {displayTasks.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No ads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Submissions Panel */}
        {/* Submissions Panel */}
        {selectedTaskId && (
          <section className="mt-6 bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Submissions for Ad #{selectedTaskId}
              </h2>
              <Button variant="outline" onClick={() => setSelectedTaskId(null)}>
                Close
              </Button>
            </div>
            {submissions.length === 0 && (
              <p className="text-gray-600"><em>No submissions yet.</em></p>
            )}
            {submissions.map(sub => (
              <div
                key={sub._id}
                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 border rounded"
              >
                <div>
                  <p>
                    <strong>User:</strong> {sub.email}
                    <p className="text-sm text-yellow-600">
    {sub.avgRating}★ ({sub.ratingCount})
  </p>
                  </p>

                  {sub.message && <p><strong>Note:</strong> {sub.message}</p>}
                  {sub.fileUrl && (
                    <p>
                      <strong>File:</strong>{' '}
                      <a
                        href={sub.fileUrl}
                        target="_blank"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Submitted: {sub.createdAt.toLocaleString()}
                  </p>

                  {sub.status === 'Rejected' && sub.rejectionReason && (
                    <p className="mt-1 text-red-600">
                      <strong>Rejection reason:</strong> {sub.rejectionReason}
                    </p>
                  )}
                  { sub.status === 'Approved' && (
  <div className="mt-2 flex items-center space-x-2">
    {/* stars state per submission: */}
    {[1,2,3,4,5].map(star => (
      <button
        key={star}
        onClick={() => setStarRating(r => ({ ...r, [sub._id]: star }))}
        className={`text-2xl ${
          (starRating[sub._id] || 0) >= star
            ? 'text-yellow-400'
            : 'text-gray-300'
        }`}
      >
        ★
      </button>
    ))}

    <Button
      size="sm"
      disabled={!starRating[sub._id]}
      onClick={async () => {
        const rating = starRating[sub._id]!;
        const res = await axios.post(`/api/users/${sub.userId}/rate`, { rating });
        if (res.data.success) {
          toast({ title: 'Rated', description: `User got ${rating}★` });
        }
      }}
    >
      Save Rating
    </Button>
  </div>
)}
                </div>

                {sub.status === 'Pending' ? (
                  <div className="mt-3 md:mt-0 space-x-2">
                    <Button size="sm" onClick={() => handleApprove(sub._id)}>
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setRejectingId(sub._id);
                        setReasonText('');
                      }}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className="px-2 py-1 text-xs bg-gray-200 rounded uppercase">
                    {sub.status}
                  </span>
                )}
              </div>
            ))}
          </section>
        )}


{/* Rejection Reason Dialog */}
<Dialog open={!!rejectingId} onClose={() => setRejectingId(null)}>
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded max-w-md w-full">
              <Dialog.Title className="text-lg font-bold mb-2">
                Provide rejection reason
              </Dialog.Title>
              <textarea
                className="w-full border p-2 mb-4"
                rows={4}
                placeholder="Why are you rejecting this submission?"
                value={reasonText}
                onChange={e => setReasonText(e.target.value)}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setRejectingId(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={submitRejection}
                  disabled={!reasonText.trim()}
                  className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </Dialog>


        {/* Add Ad Modal */}
        <AddTaskModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={async data => {
            const s = await getSession();
            await axios.post('/api/tasks', data, {
              headers: { Authorization: `Bearer ${s?.accessToken}` },
            });
            setIsAddModalOpen(false);
            await fetchTasks(true);
          }}
          createdBy={session.user.username!}
        />
      </main>
    </div>
  );
}
