// src/app/admin/dashboard/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@src/components/admin/Sidebar';
import Header from '@src/components/admin/Header';
import Card from '@src/components/admin/Card';
import OverviewGraph from '@src/components/admin/OverviewGraph';
import RecentSales from '@src/components/admin/RecentSales';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';

interface Task {
  _id: string;
  title: string;
  createdBy: string;
  reward: number;
  status: string;
  rating: number;
}

interface Totals {
  totalGross: number;
  totalFees: number;
  totalNet: number;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<Totals>({ totalGross: 0, totalFees: 0, totalNet: 0 });

  const { data: session } = useSession();

  // 1) Fetch top‑5 completed tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks/completed');
        const data = await res.json();
        if (data.success && Array.isArray(data.tasks)) {
          const topTasks = data.tasks
            .sort((a: Task, b: Task) => b.reward - a.reward)
            .slice(0, 5);
          setTasks(topTasks);
          setFilteredTasks(topTasks);
        } else {
          throw new Error('Invalid data structure');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to fetch tasks');
      }
    };

    fetchTasks();
  }, []);

  // 2) Fetch revenue totals
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get<{ success: boolean; totals: Totals }>('/api/admin/revenue');
        if (res.data.success) {
          setTotals(res.data.totals);
        }
      } catch (err) {
        console.error('Failed to fetch revenue:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRevenue();
  }, []);

  // 3) Filter tasks on search
  useEffect(() => {
    setFilteredTasks(
      tasks.filter(t =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reward.toString().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, tasks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 4) Auth & loading/error states
  if (isLoading) return <div>Loading…</div>;
  if (error)      return <div className="text-red-600">{error}</div>;

  if (
    !session ||
    ![ 
      'debmalyasen37@gmail.com',
      'souvik007b@gmail.com',
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

  return (
    <div className="flex h-full">
      <Sidebar />
      <div className="flex-1 p-6 overflow-auto">
        <Header />

        {/* Summary Cards with real data */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Gross" value={`$${totals.totalGross.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Card title="Total Fees" value={`$${totals.totalFees.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Card title="Total Net"  value={`$${totals.totalNet.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} />
          <Card title="Completed Tasks" value={tasks.length.toString()} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <OverviewGraph />
        </div>

        <div className="my-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="border rounded p-2 w-full"
          />
        </div>

        <RecentSales tasks={filteredTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
