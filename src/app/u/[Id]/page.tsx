"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import defaultProfile from "../../../assets/default_profile.png";

const UserProfile = ({ params }: { params: { Id: string } }) => {
  const [user, setUser] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const router = useRouter();
  
  const UserId = params.Id;
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      const res = await fetch(`/api/${UserId}`);
      const data = await res.json();
      
      if (data.success) {
        setUser(data.user);
        setTasks(data.tasks);
      } else {
        console.error(data.message);
        // Handle error (e.g., redirect to a 404 page)
        router.push('/404');
      }
    };

    fetchUserProfile();
  }, [UserId, router]);

  if (!user) return <div>Loading...</div>;

  const totalAmountDeposited = user.totalAmountDeposited ?? 0;
  const totalIncome = user.totalIncome ?? 0;

  return (
    <div className="user-profile p-6 max-w-6xl mx-auto bg-gradient-to-br from-purple-100 to-blue-100">
      <header className="flex items-center mb-8 bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <Image
          src={user.profilePicture || defaultProfile}
          alt={user.username}
          width={32}
          height={32}
          className="w-32 h-32 rounded-full mr-6 border-4 border-purple-300"
        />
        <div>
          <h1 className="text-4xl font-bold mb-2 text-purple-700">{user.name}</h1>
          <p className="text-xl text-purple-600">@{user.username}</p>
          <p className="text-xl text-gray-700 mt-1">{user.email}</p>
          <p className="text-xl text-gray-700 mt-1">Phone: {user.phoneNumber}</p>
          <p className="text-xl text-orange-600 mt-1">Total Deposited: ${totalAmountDeposited.toFixed(2)}</p>
          <p className="text-xl text-pink-600 mt-1">Total Income: ${totalIncome.toFixed(2)}</p>
          <p className="text-xl text-blue-600 mt-1">Rating: {user.rating}</p>
        </div>
      </header>

      <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Tasks Created</h2>
        <div className="overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-purple-50">
              <tr>
                <th className="px-4 py-2 text-left text-gray-500">Title</th>
                <th className="px-4 py-2 text-left text-gray-500">Description</th>
                <th className="px-4 py-2 text-left text-gray-500">Rating</th>
                <th className="px-4 py-2 text-left text-gray-500">Category</th>
                <th className="px-4 py-2 text-left text-gray-500">Created At</th>
                <th className="px-4 py-2 text-left text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.map((task: any, index: number) => (
                <tr key={index}>
                  <td className="px-4 py-2">
                    <a
                      href={`/TaskFeed/${task._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {task.title}
                    </a>
                  </td>
                  <td className="px-4 py-2">{task.description}</td>
                  <td className="px-4 py-2">{task.rating}</td>
                  <td className="px-4 py-2">{task.category}</td>
                  <td className="px-4 py-2">{new Date(task.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-white ${task.status === 'Approved' ? 'bg-green-500' : task.status === 'Rejected' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                      {task.status || 'Pending'}
                    </span>
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

export default UserProfile;
