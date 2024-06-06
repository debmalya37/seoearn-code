import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { IUser } from '@/models/userModel';
import AdminUserCard from './AdminUserCard';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [inactiveFreelancers, setInactiveFreelancers] = useState<IUser[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await axios.get('/api/users');
      const allUsers = response.data.users;
      setUsers(allUsers);

      const twoMonthsAgo = new Date();
      twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
      const inactiveFreelancers = allUsers.filter(user => user.role === 'freelancer' && new Date(user.lastActive) < twoMonthsAgo);
      setInactiveFreelancers(inactiveFreelancers);
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
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <section>
        <h3 className="text-xl font-semibold mb-2">Inactive Freelancers</h3>
        {inactiveFreelancers.map(user => (
          <AdminUserCard key={user._id} {...user} onAccountUpdated={handleAccountUpdated} />
        ))}
      </section>
    </AdminLayout>
  );
};

export default AdminDashboard;
