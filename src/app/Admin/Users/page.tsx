"use client";  // Ensure this is a client-side component

import React, { useEffect, useState } from 'react';
import Sidebar from '@src/components/admin/Sidebar';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

interface User {
  _id: string;
  username: string;
  email: string;
  gender: string;
  age: number;
  isVerified: boolean;
}

const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // Function to fetch data from the API
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          // Handle HTTP errors
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch users');
        }
        const data = await response.json();
        if (data && data.users) {
          setUsers(data.users);  // Update state with fetched users
        } else {
          throw new Error('Invalid data structure received');
        }
      } catch (error: any) {
        setError(error.message);  // Handle any errors
      } finally {
        setIsLoading(false);  // Set loading to false after fetch completes
      }
    };

    fetchUsers();  // Call the fetch function
  }, []);  // Empty dependency array means this effect runs once after the initial render

  if (isLoading) {
    return <div>Loading...</div>;  // Display loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>;  // Display error message if any
  }

  if (!session || !session.user || (session.user.email !== 'debmalyasen37@gmail.com' && session.user.email !== 'souvik007b@gmail.com')) {
    return (
        <div className="flex justify-center items-center h-full">
            <div className="text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="mt-4">Please sign in as an admin to view this page.</p>
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
              {users.length > 0 ? (
                users.map((user: User) => (
                  <tr key={user._id}>
                    
                    <td className="py-2 px-4 border"><Link href={`/u/${user.username}`}>{user.username}</Link></td>
                    
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
      </div>
    </div>
  );
};

export default UsersPage;
