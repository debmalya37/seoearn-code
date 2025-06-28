'use client';

import React, { FC, useCallback, useEffect, useState } from 'react';
import { getSession, useSession } from 'next-auth/react';
import axios from 'axios';
import { useToast } from '@src/components/ui/use-toast';
import Link from 'next/link';
import AddTaskModal from '@src/components/AddTaskModal';
import RequestModal from '@src/components/RequestModal';
import AdsSide from '@src/components/AdsSide';
import { Button } from '@src/components/ui/button';
import { ApiResponse } from '@src/types/ApiResponse';
import { ITask } from '@src/models/taskModel';

// Only the fields we render here
interface SimpleTask extends ITask {
  _id: string;
  title: string;
  category: string;
  reward: number;
  budget: number;
  status: 'Completed' | 'In Progress' | string;
  createdAt: Date;
}

type Tab = 'all' | 'inProgress';

const CreateAdvertisement: FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [tasks, setTasks] = useState<SimpleTask[]>([]);
  const [inProgressTasks, setInProgressTasks] = useState<SimpleTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { data: session } = useSession();
  const { toast } = useToast();

  const fetchTasks = useCallback(async (showToast = false) => {
    setLoading(true);
    try {
      const s = await getSession();
      const { data } = await axios.get<ApiResponse>('/api/ownTask', {
        headers: { Authorization: `Bearer ${s?.accessToken}` },
      });
      const raw: ITask[] = data.tasks || [];
      // Map your ITask[] → SimpleTask[]
      const mapped: SimpleTask[] = raw.map(t => ({
        _id: t._id!.toString(),
        title: t.title,
        category: t.category,
        reward: t.reward,
        budget: t.budget,
        status: t.status,
        createdAt: t.createdAt || new Date(),
        maxUsersCanDo: t.maxUsersCanDo || 0,
        description: t.description || '',
        rating: t.rating || 0,
        duration: t.duration || 0,
      })) as SimpleTask[];
      setTasks(mapped);
      setInProgressTasks(mapped.filter(t => t.status === 'In Progress'));

      if (showToast) {
        toast({ title: 'Tasks refreshed', description: 'Showing latest ads' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (session?.user) fetchTasks(true);
  }, [session, fetchTasks]);

  const updateStatus = async (id: string, status: string) => {
    await axios.put(`/api/tasks/${id}`, { status });
    await fetchTasks();
    toast({ title: 'Status updated', description: `Ad marked ${status}` });
  };

  if (!session?.user) {
    return <Link href="/sign-in">PLEASE SIGN IN</Link>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdsSide
        onOpenNewTask={() => setIsAddModalOpen(true)}
        onShowPerformance={() => toast({ title: 'Show Performance (TODO)' })}
        onShowViews={() => toast({ title: 'Show Top Views (TODO)' })}
        onShowInteractions={() => toast({ title: 'Show Interactions (TODO)' })}
      />

      <main className="flex-1 overflow-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome, {session.user.username}
          </h1>
          <Button onClick={() => fetchTasks(true)}>Refresh</Button>
        </header>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500 uppercase">Total Ads</h4>
            <p className="text-2xl font-semibold">{tasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500 uppercase">In Progress</h4>
            <p className="text-2xl font-semibold">{inProgressTasks.length}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="text-sm text-gray-500 uppercase">Completed</h4>
            <p className="text-2xl font-semibold">
              {tasks.filter(t => t.status === 'Completed').length}
            </p>
          </div>
        </section>

        {/* Tabs */}
        <section className="mb-4">
          <nav className="flex space-x-4 border-b">
            {(['all', 'inProgress'] as Tab[]).map(tab => (
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
        </section>

        {/* Table */}
        <section className="bg-white rounded shadow overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Title','Category','Reward','Budget','Status','Submissions','Created'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    {h}
                  </th>
                ))}
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(activeTab === 'all' ? tasks : inProgressTasks).map(t => (
                <tr key={t._id}>
                  <td className="px-6 py-4">
                    <Link href={`/Ads/${t._id}`} className="text-blue-600 hover:underline">
                      {t.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">{t.category}</td>
                  <td className="px-6 py-4">${t.reward}</td>
                  <td className="px-6 py-4">${t.budget}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        t.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : t.status === 'In Progress'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button size="sm" onClick={() => setSelectedTaskId(t._id)}>
                      View Subs
                    </Button>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button size="sm" onClick={() => updateStatus(t._id,'Completed')}>✔</Button>
                    <Button size="sm" variant="destructive" onClick={() => updateStatus(t._id,'Rejected')}>✕</Button>
                  </td>
                </tr>
              ))}
              {((activeTab === 'all' ? tasks : inProgressTasks).length === 0) && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No ads found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <RequestModal
          open={!!selectedTaskId}
          taskId={selectedTaskId!}
          onClose={() => setSelectedTaskId(null)}
        />

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
};

export default CreateAdvertisement;
