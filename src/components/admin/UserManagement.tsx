// src/components/UserManagement.tsx
'use client';

import { useState, useEffect } from 'react';
import { IUserCard } from '@src/app/Admin/Users/page'; // import the same interface
import { useRouter } from 'next/navigation';

interface Props {
  initialUsers: IUserCard[];
}

export default function UserManagement({ initialUsers }: Props) {
  const [users, setUsers] = useState<IUserCard[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const router = useRouter();

  // Filtered list based on search term:
  const filtered = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Generic helper to update loading state per userId:
  const setUserLoading = (userId: string, state: boolean) => {
    setLoadingMap((prev) => ({ ...prev, [userId]: state }));
  };

  // 1. Delete User
  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    setUserLoading(userId, true);
    try {
      const res = await fetch('/api/DeleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (res.ok) {
        // Remove that user from local state
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      } else {
        alert(`Failed to delete: ${data.error || data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error while deleting.');
    } finally {
      setUserLoading(userId, false);
    }
  };

  // 2. Block/Unblock User
  const handleBlock = async (userId: string, currentlyBlocked: boolean) => {
    setUserLoading(userId, true);
    try {
      const res = await fetch('/api/blockUser', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, block: !currentlyBlocked }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Update local state
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isBlocked: !currentlyBlocked } : u
          )
        );
      } else {
        alert(`Failed to update block status: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error while blocking/unblocking.');
    } finally {
      setUserLoading(userId, false);
    }
  };

  // 3. Pay User
  const handlePay = async (userId: string) => {
    const amountStr = prompt('Enter amount to pay (e.g. 10.00):');
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) {
      alert('Invalid amount');
      return;
    }

    setUserLoading(userId, true);
    try {
      const res = await fetch('/api/payUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, amount }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Open the Payeer payment URL in a new tab/window:
        window.open(data.paymentUrl, '_blank');
        alert('Payment request created. Complete it in the new window.');
        // We do NOT remove user from list; we might want to show a “pending” badge instead.
      } else {
        alert(`Payment API error: ${data.message || JSON.stringify(data.detail)}`);
      }
    } catch (err) {
      console.error(err);
      alert('Server error while creating payment.');
    } finally {
      setUserLoading(userId, false);
    }
  };

  return (
    <div className="w-full max-w-screen-lg mx-auto space-y-4">
      {/* --- Search Bar --- */}
      <div className="flex items-center mb-2">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={() => {
            // Simply reload from server to get newest data
            router.refresh();
          }}
          className="ml-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
        >
          Refresh
        </button>
      </div>

      {/* --- Header Row --- */}
      <div className="bg-gray-200 p-2 rounded-lg shadow-md flex items-center border-b border-gray-300 font-medium text-gray-700">
        <span className="flex-1 text-center">Username</span>
        <span className="flex-1 text-center">Name</span>
        <span className="flex-1 text-center">Email</span>
        <span className="flex-1 text-center">Age</span>
        <span className="flex-1 text-center">Gender</span>
        <span className="flex-1 text-center">Verified</span>
        <span className="flex-1 text-center">Blocked</span>
        <span className="flex-2 text-center">Actions</span>
      </div>

      {/* --- User Rows --- */}
      {filtered.length > 0 ? (
        filtered.map((u) => (
          <div
            key={u._id}
            className="bg-white p-2 rounded-lg shadow-sm flex items-center border border-gray-200"
          >
            <span className="flex-1 text-center">{u.username}</span>
            <span className="flex-1 text-center">{u.name}</span>
            <span className="flex-1 text-center">{u.email}</span>
            <span className="flex-1 text-center">{u.age}</span>
            <span className="flex-1 text-center">{u.gender}</span>
            <span className="flex-1 text-center">
              {u.isVerified ? 'Yes' : 'No'}
            </span>
            <span className="flex-1 text-center">
              {u.isBlocked ? (
                <span className="text-red-600 font-semibold">Blocked</span>
              ) : (
                <span className="text-green-600 font-semibold">Active</span>
              )}
            </span>
            <div className="flex flex-2 justify-center space-x-1">
              {/* Block/Unblock */}
              <button
                onClick={() => handleBlock(u._id, !!u.isBlocked)}
                disabled={!!loadingMap[u._id]}
                className={`px-2 py-1 text-xs rounded-md ${
                  u.isBlocked
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {u.isBlocked ? 'Unblock' : 'Block'}
              </button>

              {/* Pay */}
              <button
                onClick={() => handlePay(u._id)}
                disabled={!!loadingMap[u._id]}
                className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs rounded-md"
              >
                Pay
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDelete(u._id)}
                disabled={!!loadingMap[u._id]}
                className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 text-xs rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No users found.</div>
      )}
    </div>
  );
}
