// src/app/Admin/Users/page.tsx

export const dynamic = 'force-dynamic';

import Sidebar from '@src/components/admin/Sidebar';
import UserManagement from '@src/components/admin/UserManagement';
import { fetchUsers } from '@src/actions/useractions';

import Link from 'next/link';

export interface IUserCard {
  _id: string;
  username: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  isVerified: boolean;
  isBlocked?: boolean; // <— include blocked status
}

export default async function UsersPage() {

  
  
  // 1. Fetch user list from server action (this returns all fields we need)
  const users: IUserCard[] = await fetchUsers();

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="w-full">
        <UserManagement initialUsers={users} />
      </div>
    </div>
  );
}
