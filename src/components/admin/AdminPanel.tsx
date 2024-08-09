// adminpanel.tsx
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch('/api/stats');
      const data = await res.json();
      setStats(data);
    };
    fetchStats();
  }, []);

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        const updatedStats = { ...stats };
        const updatedTaskList = updatedStats.taskStats.taskList.map((task: any) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        );
        setStats({
          ...updatedStats,
          taskStats: { ...updatedStats.taskStats, taskList: updatedTaskList },
        });
      } else {
        console.error('Failed to update task status');
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  if (!stats) return <div>Loading...</div>;

  const { userStats, taskStats } = stats;

  return (
    <div className="admin-dashboard p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {/* Stats sections */}
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{userStats.totalUsers}</div>
          <div className="text-gray-500">Total Users</div>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{userStats.avgAge.toFixed(2)}</div>
          <div className="text-gray-500">Average Age</div>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{userStats.totalFemaleUsers}</div>
          <div className="text-gray-500">Total Female Users</div>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{userStats.totalMaleUsers}</div>
          <div className="text-gray-500">Total Male Users</div>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{userStats.activeUsers}</div>
          <div className="text-gray-500">Active Users</div>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <div className="text-2xl font-bold">{taskStats.totalTasks}</div>
          <div className="text-gray-500">Total Tasks</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">User List</h2>
        <div className="bg-white p-6 rounded shadow overflow-auto max-h-96">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Username</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Gender</th>
                <th className="px-4 py-2">Age</th>
                <th className="px-4 py-2">Verified</th>
              </tr>
            </thead>
            <tbody>
              {userStats.userList.map((user: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <Link href={`/u/${user.username}`}>
                      <span className="text-blue-500 hover:underline">{user.username}</span>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.gender}</td>
                  <td className="border px-4 py-2">{user.age}</td>
                  <td className="border px-4 py-2">{user.isVerified ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Task List</h2>
        <div className="bg-white p-6 rounded shadow overflow-auto max-h-96">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Rating</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Created By</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {taskStats.taskList.map((task: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    <Link href={`/Admin/Utask/${task._id}`}>
                      <span className="text-blue-500 hover:underline">{task.title}</span>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">{task.rating}</td>
                  <td className="border px-4 py-2">{task.category}</td>
                  <td className="border px-4 py-2">{new Date(task.createdAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">
                    <Link href={`/u/${task.createdBy}`}>
                      <span className="text-blue-500 hover:underline">{task.createdBy}</span>
                    </Link>
                  </td>
                  <td className="border px-4 py-2">{task.status || 'Pending'}</td>
                  <td className="border px-4 py-2">
                    {task.status === 'Approved' || task.status === 'Rejected' ? (
                      <span className="text-gray-500">-</span>
                    ) : (
                      <>
                        <button
                          onClick={() => updateTaskStatus(task._id, 'Approved')}
                          className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task._id, 'Rejected')}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
