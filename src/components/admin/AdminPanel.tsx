import Image from 'next/image';
import React from 'react';
import profilepicDemo from "../../../public/rcb pic logo.jpeg";
const AdminDashboard = () => {
  const stats = [
    { label: 'Countries', value: 27, icon: '🌍' },
    { label: 'Total Users', value: 5325, icon: '👥' },
    { label: 'Active Users', value: 1962, icon: '🟢' },
    { label: 'Total Tasks', value: 326, icon: '📋' },
    { label: 'Active Tasks', value: 29, icon: '🔄' },
  ];

  const tasks = Array.from({ length: 9 }, (_, i) => ({
    name: `task ${i + 1}`,
    time: '2 min',
    earning: '$1.50',
  }));

  return (
    <div className="admin-dashboard p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center">
          <span className="mr-4">Settings</span>
          <input type="text" placeholder="Search content..." className="p-2 border rounded" />
          <Image src={profilepicDemo} alt="Admin's User ID" className="ml-4 rounded-full w-10 h-10" />
        </div>
      </header>

      <div className="grid grid-cols-5 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card p-4 bg-white shadow rounded-lg flex items-center">
            <div className="stat-icon text-2xl mr-4">{stat.icon}</div>
            <div>
              <div className="text-lg font-semibold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="task-list bg-white p-6 shadow rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">TASKS</h2>
        <p className="text-gray-600 mb-4">Your Central Hub for Managing and Optimizing Platform Operations</p>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-left">Tasks</th>
              <th className="border p-2 text-left">Time takes to Complete</th>
              <th className="border p-2 text-left">Earning</th>
              <th className="border p-2 text-left">Review / Delete</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="border p-2">{task.name}</td>
                <td className="border p-2">{task.time}</td>
                <td className="border p-2">{task.earning}</td>
                <td className="border p-2 flex">
                  <button className="mr-2 bg-purple-500 text-white p-2 rounded">Review</button>
                  <button className="bg-orange-500 text-white p-2 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination flex justify-center mt-4">
          <button className="p-2">&laquo;</button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button key={page} className="p-2 mx-1">{page}</button>
          ))}
          <button className="p-2">&raquo;</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
