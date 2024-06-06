import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { IUser } from '@/models/userModel';
import AdminUserCard from './AdminUserCard';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
    };

    fetchUsers();
  }, []);

  const handleAccountUpdated = () => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      setUsers(response.data.users);
    };
    fetchUsers();
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
      {users.map(user => (
        <AdminUserCard key={user._id} {...user} onAccountUpdated={handleAccountUpdated} />
      ))}
    </AdminLayout>
  );
};

export default ManageUsers;
