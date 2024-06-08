"use client";
import Image from 'next/image';
import React, { useState } from 'react';
import profilepicDemo from "../../../public/rcb pic logo.jpeg";
import TaskList from './TaskList';
import UserList from './UserList';
import ReviewTaskModal from './ReviewTaskModal';
import UserProfileModal from './UserProfileModal';

const AdminDashboard = () => {
  const [selectedSection, setSelectedSection] = useState<string>('tasks');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState<boolean>(false);
  const [taskToReview, setTaskToReview] = useState<any>(null);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1',email: "demo@email.com", time: '2 min', earning: 1.50, status: 'Pending' },
    { id: 2, name: 'Task 2',email: "demo@email.com", time: '2 min', earning: 1.50, status: 'Pending' },
    { id: 3, name: 'Task 3',email: "demo@email.com", time: '3 min', earning: 1.50, status: 'Pending' },
    { id: 4, name: 'Task 4',email: "demo@email.com", time: '2 min', earning: 1.50, status: 'Pending' },
    // Add more tasks as needed
  ]);
  const [userToView, setUserToView] = useState<any>(null);

  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
  };

  const handleReviewTask = (task: any) => {
    setTaskToReview(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToReview(null);
  };

  const handleToggleUsers = () => {
    setShowUsers(!showUsers);
  };

  const handleViewUser = (user: any) => {
    setUserToView(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setUserToView(null);
  };
  const handleDeleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };
  const handleUpdateTask = (updatedTask: any) => {
    // Update the task in the task list
    setTaskToReview(updatedTask);
    setIsTaskModalOpen(false);
  };

  const stats = [
    { label: 'Countries', value: 27, icon: '🌍' },
    { label: 'Total Users', value: 5325, icon: '👥', onClick: handleToggleUsers },
    { label: 'Active Users', value: 1962, icon: '🟢' },
    { label: 'Total Tasks', value: 326, icon: '📋' },
    { label: 'Active Tasks', value: 29, icon: '🔄' },
    { label: 'Total Revenue', value: '$12,345.67', icon: '💰' },
  ];

  return (
    <div className="admin-dashboard p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center">
          <input type="text" placeholder="Search content..." className="p-2 border rounded" />
          <Image src={profilepicDemo} alt="Profile" className="ml-4 rounded-full" width={50} height={50} />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="bg-white p-6 rounded shadow cursor-pointer flex items-center justify-between"
            onClick={stat.onClick}
          >
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-gray-500">{stat.label}</div>
            </div>
            <div className="text-3xl">{stat.icon}</div>
          </div>
        ))}
      </div>

      <nav className="mb-4">
        <ul className="flex space-x-4">
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedSection === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleSectionChange('tasks')}
            >
              Tasks
            </button>
          </li>
          <li>
            <button
              className={`px-4 py-2 rounded ${selectedSection === 'users' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleSectionChange('users')}
            >
              Users
            </button>
          </li>
        </ul>
      </nav>

      {selectedSection === 'tasks' &&  <TaskList tasks={tasks} onReviewTask={handleReviewTask} onDeleteTask={handleDeleteTask} />}
      {selectedSection === 'users' && <UserList onViewUser={handleViewUser} />}

      {isTaskModalOpen && taskToReview && (
        <ReviewTaskModal task={taskToReview} onClose={closeTaskModal} onUpdateTask={handleUpdateTask} />
      )}

      {isUserModalOpen && userToView && (
        <UserProfileModal user={userToView} onClose={closeUserModal} />
      )}
    </div>
  );
};

export default AdminDashboard;
