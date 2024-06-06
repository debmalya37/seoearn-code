import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { ITask } from '@/models/taskModel';
import TaskCard from './TaskCard';

const ReviewTasks: React.FC = () => {
  const [tasks, setTasks] = useState<ITask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get('/api/tasks?status=pending');
      setTasks(response.data.tasks);
    };

    fetchTasks();
  }, []);

  const handleTaskUpdated = () => {
    const fetchTasks = async () => {
      const response = await axios.get('/api/tasks?status=pending');
      setTasks(response.data.tasks);
    };
    fetchTasks();
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold mb-4">Review Tasks</h2>
      {tasks.map(task => (
        <TaskCard key={task._id} {...task} onTaskUpdated={handleTaskUpdated} />
      ))}
    </AdminLayout>
  );
};

export default ReviewTasks;
