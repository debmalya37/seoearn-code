// src/app/admin/tasks/AdminTasksClient.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// interface Task {
//   _id: string;
//   title: string;
//   description: string;
//   rating: number;
//   status: string;
//   reward: number;
//   budget: number;
//   maxUsersCanDo: number;
// }

interface Props {
  initialTasks: Task[];
  initialTotalTasks: number;
}

interface Request {
    _id: string;
    userId: string;
    message?: string;
    fileUrl?: string;
    status: string;
    createdAt: string;
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
  }
  

export default function AdminTasksClient({ initialTasks, initialTotalTasks }: Props) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [totalTasks, setTotalTasks] = useState(initialTotalTasks);
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const limit = 10;
  const { data: session } = useSession();

  // Fetch one page of tasks
  async function loadPage(page: number) {
    const res = await fetch(`/api/tasks?page=${page}&limit=${limit}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch');
    return { tasks: json.tasks as Task[], totalTasks: json.totalTasks as number };
  }

  // Called when user clicks Prev/Next
  const handlePageChange = (page: number) => {
    startTransition(() => {
      loadPage(page)
        .then(({ tasks: newTasks, totalTasks }) => {
          setTasks(newTasks);
          setTotalTasks(totalTasks);
          setCurrentPage(page);
        })
        .catch(err => console.error(err));
    });
  };

  // Approve or reject a single task
  const updateStatus = (
    taskId: string,
    submissionId: string,
    submitterId: string,
    newStatus: 'approved' | 'rejected'
  ) => {
    fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: newStatus,
        submissionId,
        submitterId
      }),
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          // Update locally
          setTasks((curr) =>
            curr.map((t) =>
              t._id === taskId
                ? {
                    ...t,
                    requests: t.requests?.map((r) =>
                      r._id === submissionId ? { ...r, status: newStatus } : r
                    ),
                  }
                : t
            )
          );
        } else {
          console.error('Update failed:', json.message);
        }
      })
      .catch(console.error);
  };
  

  return (
    <main className="flex-1 p-6">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">All Tasks</h1>
        <input
          type="text"
          placeholder="Search tasks…"
          className="w-1/3 px-4 py-2 border rounded"
        />
      </header>

      <div className="overflow-x-auto shadow rounded bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['Title','Desc','Rating','Status','Reward','Budget','Max','Actions'].map(h => (
                <th key={h} className="px-4 py-2 text-left text-xs font-semibold uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map(task => (
              <tr key={task._id}>
                <td className="px-4 py-2 text-indigo-600">
                  <Link href={`/Admin/Utask/${task._id}`}>{task.title}</Link>
                </td>
                <td className="px-4 py-2 hidden sm:table-cell truncate max-w-xs">{task.description}</td>
                <td className="px-4 py-2 hidden md:table-cell">{task.rating}</td>
                <td className="px-4 py-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    task.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : task.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-2 hidden lg:table-cell">${task.reward}</td>
                <td className="px-4 py-2 hidden lg:table-cell">${task.budget}</td>
                <td className="px-4 py-2 hidden xl:table-cell">{task.maxUsersCanDo}</td>
                <td className="px-4 py-2 space-y-1">
  {task.requests?.length ? (
    task.requests.map((req) => (
      <div key={req._id} className="flex gap-2 items-center">
        <span className="text-sm text-gray-600 truncate max-w-[120px]">{req.userId}</span>
        {req.status.toLowerCase() === 'pending' ? (

          <>
            <button
              onClick={() => updateStatus(task._id, req._id, req.userId, 'approved')}
              className="px-2 py-1 text-xs bg-green-600 text-white rounded"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus(task._id, req._id, req.userId, 'rejected')}
              className="px-2 py-1 text-xs bg-red-600 text-white rounded"
            >
              Reject
            </button>
          </>
        ) : (
          <span className="text-xs text-gray-400"> {req.userId} ({req.status})</span>
        )}
      </div>
    ))
  ) : (
    <span className="text-xs text-gray-400">No Requests</span>
  )}
</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1 || isPending}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(totalTasks / limit)}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === Math.ceil(totalTasks / limit) || isPending}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}
