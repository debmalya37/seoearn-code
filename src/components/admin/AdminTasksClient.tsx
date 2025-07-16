// src/app/admin/tasks/AdminTasksClient.tsx
'use client';
import React, { useState, useTransition, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { FaChevronCircleRight, FaChevronDown } from 'react-icons/fa';

interface Request {
  _id: string;
  status: string;
  rejectionReason?: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  rating: number;
  status: string;
  reward: number;
  budget: number;
  maxUsersCanDo: number;
  requests?: Request[];
  createdBy: string;
  isApproved?: boolean;
}

interface Props {
  initialTasks: Task[];
  initialTotalTasks: number;
}

export default function AdminTasksClient({ initialTasks, initialTotalTasks }: Props) {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [emails, setEmails] = useState<Record<string,string>>({});
  const [totalTasks, setTotalTasks] = useState(initialTotalTasks);
  const [page, setPage] = useState(1);
  const [ratingDialogUser, setRatingDialogUser] = useState<string|null>(null);
const [newRating, setNewRating] = useState(0);
  const [isPending, startTransition] = useTransition();
    // 1. Extend your Tasks state to carry per‑user rating
const [ratings, setRatings] = useState<Record<string,{ average: number; count: number }>>({});
  const limit = 10;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // 1) Fetch a page of tasks
  async function loadPage(p: number) {
    const res = await fetch(`/api/tasks?page=${p}&limit=${limit}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message);
    return { tasks: json.tasks as Task[], totalTasks: json.totalTasks as number };
  }

  // 2) Batch-fetch advertiser emails
  async function fetchEmails(taskList: Task[]) {
    const ids = Array.from(new Set(taskList.map(t => t.createdBy)));
    const fetched = await Promise.all(
      ids.map(id =>
        fetch(`/api/users/${id}`)
          .then(r => r.json())
          .then(u => ({ id, email: u.user.email }))
      )
    );
    setEmails(Object.fromEntries(fetched.map(x => [x.id, x.email])));
  }



// 2. New helper to fetch rating stats
async function fetchRatings(taskList: Task[]) {
  const ids = Array.from(new Set(taskList.map(t => t.createdBy)));
  const fetched = await Promise.all(
    ids.map(id =>
      fetch(`/api/users/${id}`)
        .then(r => r.json())
        .then(j => ({ id, rating: j.user.rating }))
    )
  );
  setRatings(Object.fromEntries(fetched.map(x => [x.id, x.rating])));
}
  // 3) Navigate pages and refresh emails
  const goPage = (p: number) => {
    startTransition(() => {
      loadPage(p).then(({ tasks: tks, totalTasks }) => {
        setTasks(tks);
        setTotalTasks(totalTasks);
        setPage(p);
        fetchEmails(tks);
        fetchRatings(tks); // fetch ratings for the new page
      });
    });
  };

  useEffect(() => { goPage(1) }, []);



  

  // Fetch a page of tasks
  // async function loadPage(p: number) {
  //   const res = await fetch(`/api/tasks?page=${p}&limit=${limit}`);
  //   const json = await res.json();
  //   if (!json.success) throw new Error(json.message);
  //   return { tasks: json.tasks as Task[], totalTasks: json.totalTasks as number };
  // }
  // Batch‐fetch advertiser emails
  // async function fetchEmails(taskList: Task[]) {
  //   const ids = Array.from(new Set(taskList.map(t => t.createdBy)));
  //   const fetched = await Promise.all(
  //     ids.map(id =>
  //       fetch(`/api/users/${id}`)
  //         .then(r => r.json())
  //         .then(u => ({ id, email: u.user.email }))
  //     )
  //   );
  //   setEmails(Object.fromEntries(fetched.map(x => [x.id, x.email])));
  // }

  // const goPage = (p: number) => {
  //   startTransition(async () => {
  //     const { tasks: tks, totalTasks } = await loadPage(p);
  //     setTasks(tks);
  //     setTotalTasks(totalTasks);
  //     setPage(p);
  //     fetchEmails(tks);
  //   });
  // };

  // 4) Ban & contact handlers (unchanged) …
  const banAdvertiser = async (userId: string) => {
    if (!confirm('Ban this advertiser?')) return;
    const res = await fetch('/api/admin/ban-user', {
      method: 'POST',
      headers:{ 'Content-Type':'application/json' },
      body: JSON.stringify({ userId })
    });
    const j = await res.json();
    if (!j.success) return alert('Error: '+j.message);
    alert(`Banned ${emails[userId]}`);
  };
  const contactAdvertiser = (email:string) => {
    window.location.href = `mailto:${email}`;
  };

  if (!session) return <p>Loading…</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>
      <div className="overflow-auto bg-white rounded shadow">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              {[
                '⇕','Title','Desc','Rating','Status',
                'Reward','Budget','Max','Advertiser',
                'Subs','Actions'
              ].map(h => (
                <th key={h} className="p-2 text-xs font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <React.Fragment key={t._id}>
                {/* ─── Main Row ─── */}
                <tr className="border-b">
                  {/* toggle */}
                  <td className="p-2">
                    <button
                      onClick={() =>
                        setExpanded(e => ({ ...e, [t._id]: !e[t._id] }))
                      }
                    >
                      {expanded[t._id]
                        ? <FaChevronDown size={12}/>
                        : <FaChevronCircleRight size={12}/>}
                    </button>
                  </td>
                  <td className="p-2 text-indigo-600">
                    <Link href={`/Admin/Utask/${t._id}`}>{t.title}</Link>
                  </td>
                  <td className="p-2 truncate">{t.description}</td>
                  <td className="p-2">{t.rating}</td>
                  <td className="p-2">{t.status}</td>
                  <td className="p-2">${t.reward}</td>
                  <td className="p-2">${t.budget}</td>
                  <td className="p-2">{t.maxUsersCanDo}</td>
                  <td className="p-2">{emails[t.createdBy] || '…'}</td>
                  <td className="p-2">
                    {t.requests?.length ?? 0}
                  </td>
                  <td className="p-2">
                    {!t.isApproved && (
                      <>
                        <button
                          onClick={async () => {
                            if (!confirm("Approve this task?")) return;
                            const res = await fetch('/api/admin/tasks/approve',{
                              method:'POST',
                              headers:{'Content-Type':'application/json'},
                              body:JSON.stringify({ taskId:t._id })
                            });
                            const j = await res.json();
                            if (j.success) goPage(page);
                            else alert('Error: '+j.message);
                          }}
                          className="px-2 py-1 text-xs bg-green-600 text-white rounded mr-2"
                        >Approve</button>
                        <button
                          onClick={async () => {
                            if (!confirm("Reject this task?")) return;
                            const res = await fetch('/api/admin/tasks/reject',{
                              method:'POST',
                              headers:{'Content-Type':'application/json'},
                              body:JSON.stringify({ taskId:t._id })
                            });
                            const j = await res.json();
                            if (j.success) goPage(page);
                            else alert('Error: '+j.message);
                          }}
                          className="px-2 py-1 text-xs bg-red-700 text-white rounded"
                        >Reject</button>
                      </>
                    )}
                  </td>


                </tr>

                {/* ─── Expanded Detail Row ─── */}
                {expanded[t._id] && (
                  <tr className="bg-gray-50">
                    <td className="p-2">
                    {ratings[t.createdBy]
                      ? (
                        <div className="flex items-center space-x-1">
                          {/* show average as stars */}
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i}>
                              {i < Math.round(ratings[t.createdBy].average) ? '★' : '☆'}
                            </span>
                          ))}
                          <span className="text-xs text-gray-600">
                            ({ratings[t.createdBy].count})
                          </span>
                        </div>
                      )
                      : '…'
                    }
                  </td>
                <td className="p-2 space-x-1">
                <button
                  onClick={() => {
                    setRatingDialogUser(t.createdBy);
                    setNewRating(0);
                  }}
                  className="px-2 py-1 text-xs bg-yellow-500 text-white rounded"
                >
                  Rate
                </button>
                {/* Rate User Dialog */}
{ratingDialogUser && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50">
    <div className="bg-white p-6 rounded max-w-sm w-full space-y-4">
      <h2 className="text-lg font-bold">Rate this advertiser</h2>
      <div className="flex space-x-1 text-2xl">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setNewRating(i+1)}
            className="focus:outline-none"
          >
            {i < newRating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setRatingDialogUser(null)}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            if (!newRating) return;
            const res = await fetch(`/api/users/${ratingDialogUser}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ rating: newRating }),
            });
            const json = await res.json();
            if (json.success) {
              setRatings(ratings => ({
                ...ratings,
                [ratingDialogUser]: json.rating
              }));
              setRatingDialogUser(null);
            } else {
              alert('Failed: ' + json.message);
            }
          }}
          className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
          disabled={!newRating}
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}


                  <button
                    onClick={() => banAdvertiser(t.createdBy)}
                    className="px-2 py-1 text-xs bg-red-600 text-white rounded"
                  >
                    Ban
                  </button>
                  <button
                    onClick={() => contactAdvertiser(emails[t.createdBy]||'')}
                    className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                  >
                    Contact
                  </button>
                </td>
                    <td colSpan={11} className="p-4">
                      <h3 className="font-semibold mb-2">Submissions</h3>

                      {/* Approved */}
                      <div className="mb-4">
                        <h4 className="text-green-700 font-medium">✅ Approved:</h4>
                        {t.requests?.filter(r => r.status==='Approved').length
                          ? t.requests!
                              .filter(r => r.status==='Approved')
                              .map(r => (
                                <div key={r._id} className="ml-4 text-sm">
                                  Submission ID: <code>{r._id}</code>
                                </div>
                              ))
                          : <p className="ml-4 text-sm text-gray-500">None</p>
                        }
                        
                      </div>

                      {/* Rejected */}
                      <div>
                        <h4 className="text-red-700 font-medium">❌ Rejected:</h4>
                        {t.requests?.filter(r => r.status==='Rejected').length
                          ? t.requests!
                              .filter(r => r.status==='Rejected')
                              .map(r => (
                                <div key={r._id} className="ml-4 text-sm">
                                  <p>
                                    <span className="font-semibold">ID:</span> <code>{r._id}</code>
                                  </p>
                                  <p>
                                    <span className="font-semibold">Reason:</span> {r.rejectionReason}
                                  </p>
                                </div>
                              ))
                          : <p className="ml-4 text-sm text-gray-500">None</p>
                        }
                      </div>
                    </td>
                    
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => goPage(page - 1)}
          disabled={page === 1 || isPending}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >Previous</button>
        <span>Page {page} of {Math.ceil(totalTasks/limit)}</span>
        <button
          onClick={() => goPage(page + 1)}
          disabled={page === Math.ceil(totalTasks/limit) || isPending}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >Next</button>
      </div>
    </main>
  );
}
