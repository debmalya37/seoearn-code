"use client";
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

  if (!stats) return <div>Loading...</div>;

  const { userStats, taskStats } = stats;

  return (
    <div className="admin-dashboard p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        {/* Other header elements */}
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
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
                  <td className="border px-4 py-2">{user.username}</td>
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
              </tr>
            </thead>
            <tbody>
              {taskStats.taskList.map((task: any, index: number) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{task.title}</td>
                  <td className="border px-4 py-2">{task.description}</td>
                  <td className="border px-4 py-2">{task.rating}</td>
                  <td className="border px-4 py-2">{task.category}</td>
                  <td className="border px-4 py-2">{new Date(task.createdAt).toLocaleString()}</td>
                  <td className="border px-4 py-2">{task.createdBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Other dashboard components */}
    </div>
  );
};

export default AdminDashboard;
