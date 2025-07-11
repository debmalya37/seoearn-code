// src/app/admin/tasks/page.tsx
import React from 'react';
import AdminTasksClient from '@src/components/admin/AdminTasksClient'; // the client component
import Sidebar from '@src/components/admin/Sidebar';

interface Task {
  _id: string;
  title: string;
  description: string;
  rating: number;
  status: string;
  reward: number;
  budget: number;
  maxUsersCanDo: number;
}

async function fetchTasks(page: number, limit: number) {
  const res = await fetch(`https://seoearningspace.com/api/tasks?page=${page}&limit=${limit}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return { tasks: data.tasks as Task[], totalTasks: data.totalTasks as number };
}

export default async function Page() {
  // Server‐side: fetch initial page 1
  const { tasks, totalTasks } = await fetchTasks(1, 10);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-r from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors">
      <Sidebar />
      <AdminTasksClient
        initialTasks={tasks}
        initialTotalTasks={totalTasks}
      />
    </div>
  );
}
