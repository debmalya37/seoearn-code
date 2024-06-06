import React from 'react';
import axios from 'axios';
import { IUser } from '@/models/userModel';
import  toast  from '../ui/toast';

interface AdminUserCardProps extends IUser {
  onAccountUpdated: () => void;
}

const AdminUserCard: React.FC<AdminUserCardProps> = ({ _id, name, email, role, status, onAccountUpdated }) => {

  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete(`/api/users/${_id}`);
      toast({ title: response.data.message });
      onAccountUpdated();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete account', variant: 'destructive' });
    }
  };

  const handleSuspendAccount = async () => {
    try {
      const response = await axios.put(`/api/users/${_id}`, { status: 'Suspended' });
      toast({ title: response.data.message });
      onAccountUpdated();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to suspend account', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{email}</p>
      <p className="text-gray-600">Role: {role}</p>
      <p className="text-gray-600">Status: {status}</p>
      <div className="mt-4 flex justify-between">
        <button onClick={handleSuspendAccount} className="text-yellow-600">Suspend</button>
        <button onClick={handleDeleteAccount} className="text-red-600">Delete</button>
      </div>
    </div>
  );
};

export default AdminUserCard;
