import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/auth';

const AdminLayout: React.FC = ({ children }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  if (!user || user.role !== 'admin') {
    router.push('/login');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/admin/dashboard">
                <a className="block p-4 hover:bg-gray-200">Dashboard</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/users">
                <a className="block p-4 hover:bg-gray-200">Manage Users</a>
              </Link>
            </li>
            <li>
              <Link href="/admin/tasks">
                <a className="block p-4 hover:bg-gray-200">Review Tasks</a>
              </Link>
            </li>
          </ul>
        </nav>
        <button onClick={logout} className="block p-4 hover:bg-gray-200 text-red-600">
          Logout
        </button>
      </aside>
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
