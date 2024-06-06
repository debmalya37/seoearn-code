import React from 'react';
import axios from 'axios';
import { ITask } from '@/models/taskModel';
import { useToast } from '../ui/use-toast';

interface TaskCardProps extends ITask {
  onTaskUpdated: () => void;
}
const toast = useToast();
const TaskCard: React.FC<TaskCardProps> = ({ _id, title, description, status, onTaskUpdated }) => {

  const handleApproveTask = async () => {
    try {
      const response = await axios.put(`/api/tasks/${_id}`, { status: 'approved' });
      toast({ title: response.data.message });
      onTaskUpdated();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve task', variant: 'destructive' });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600">{description}</
