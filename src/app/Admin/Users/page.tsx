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
    userList: User[];
  };
}

const fetchStats = async (): Promise<StatsResponse> => {
  try {
    const res = await fetch(`http:www.seoearningspace.com/api/stats`, {
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
        userList: []
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
        {/* Optional: Pagination component can be added here if user list is large */}
      </div>
    </div>
  );
};

export default UsersPage;
