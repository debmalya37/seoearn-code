import React from 'react';
import Sidebar from '@src/components/admin/Sidebar';

interface User {
  _id: string;
  username: string;
  email: string;
  gender: string;
  age: number;
  isVerified: boolean;
}

interface StatsResponse {
  userStats: {
    totalUsers: number;
    avgAge: number;
    totalMaleUsers: number;
    totalFemaleUsers: number;
    activeUsers: number;
    userList: User[];
  };
  taskStats: {
    totalTasks: number;
    taskList: any[]; // Adjust based on your Task schema
  };
}

const fetchStats = async (): Promise<StatsResponse> => {
  try {
      const res = await fetch(`http://localhost:3000/api/stats?_=${new Date().getTime()}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      if (!res.ok) {
          const errorData = await res.json();
          console.error('Failed to fetch stats:', errorData.error || 'Unknown error');
          throw new Error(errorData.error || 'Failed to fetch stats');
      }

      return await res.json();
  } catch (error: any) {
      console.error('Error fetching stats:', error.message);
      return {
          userStats: {
              totalUsers: 0,
              avgAge: 0,
              totalMaleUsers: 0,
              totalFemaleUsers: 0,
              activeUsers: 0,
              userList: []
          },
          taskStats: {
              totalTasks: 0,
              taskList: []
          }
      };
  }
};


const UsersPage = async () => {
  const { userStats } = await fetchStats();

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border">Username</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Gender</th>
                <th className="py-2 px-4 border">Age</th>
                <th className="py-2 px-4 border">Verified</th>
              </tr>
            </thead>
            <tbody>
              {userStats.userList.length > 0 ? (
                userStats.userList.map((user: User) => (
                  <tr key={user._id}>
                    <td className="py-2 px-4 border">{user.username}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">{user.gender}</td>
                    <td className="py-2 px-4 border">{user.age}</td>
                    <td className="py-2 px-4 border">{user.isVerified ? 'Yes' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-2 px-4 border text-center">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">User Statistics</h2>
          <p>Total Users: {userStats.totalUsers}</p>
          <p>Average Age: {userStats.avgAge.toFixed(2)}</p>
          <p>Total Male Users: {userStats.totalMaleUsers}</p>
          <p>Total Female Users: {userStats.totalFemaleUsers}</p>
          <p>Active Users: {userStats.activeUsers}</p>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
