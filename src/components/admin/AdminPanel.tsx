"use client";
import React, { useState } from 'react';
import DashboardCard from './DashboardCard';
import UserList from './UserList';
import TaskList from './TaskList';
import ReviewTaskModal from './ReviewTaskModal';

const AdminPanel = () => {
  const [showUsers, setShowUsers] = useState(false);
  const [reviewTask, setReviewTask] = useState(null);
  const [users, setUsers] = useState([
    { id: 1, name: 'User One', email: 'userone@example.com', rating: 0 },
    { id: 2, name: 'User Two', email: 'usertwo@example.com', rating: 0 },
    // Add more users as needed
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'task 1', time: '2 min', earning: 1.50, status: 'Pending' },
    { id: 2, name: 'task 2', time: '2 min', earning: 1.50, status: 'Pending' },
    // Add more tasks as needed
  ]);

  const handleShowUsers = () => {
    setShowUsers(!showUsers);
  };

  const handleRateUser = (id: number, rating: any) => {
    setUsers(users.map(user => user.id === id ? { ...user, rating } : user));
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleReviewTask = (taskId: number) => {
    const task = tasks.find(task => task.id === taskId);
    setReviewTask(task);
  };

  const handleTaskStatusChange = (status: any) => {
    setTasks(tasks.map(task => task.id === reviewTask.id ? { ...task, status } : task));
    setReviewTask(null);  // Close the review modal
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Countries" value="27" />
        <DashboardCard title="Total Users" value="5,325" onClick={handleShowUsers} />
        <DashboardCard title="Active Users" value="1,962" />
        <DashboardCard title="Total Tasks" value="326" />
        <DashboardCard title="Active Tasks" value="29" />
        <DashboardCard title="Total Revenue" value="$9,876.00" />
      </div>
      {showUsers && (
        <UserList users={users} onRateUser={handleRateUser} onDeleteUser={handleDeleteUser} />
      )}
      <TaskList tasks={tasks} onReviewTask={handleReviewTask} onDeleteTask={handleDeleteTask} />
      {reviewTask && (
        <ReviewTaskModal
          task={reviewTask}
          onClose={() => setReviewTask(null)}
          onUpdateStatus={handleTaskStatusChange}
        />
      )}
    </div>
  );
};

export default AdminPanel;
