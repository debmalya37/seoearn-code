
"use client"
import React, { FC, useState } from 'react';
import TaskCard from '@/components/TaskCard';
import TaskDetails from '@/components/TaskDetails';
import AddTaskModal from '@/components/AddTaskModal';
import Nav from '@/components/Nav';

export interface TaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  rewardPrice: number;
}

const mockTasks: TaskData[] = [
  {
    title: 'Task 1',
    description: 'Description of Task 1',
    rating: 4.5,
    category: 'Category 1',
    duration: '1 hour',
    createdBy: 'User 1',
    rewardPrice: 10,
  },
  {
    title: 'Task 2',
    description: 'Description of Task 2',
    rating: 5,
    category: 'youtube',
    duration: '1 hour',
    createdBy: 'User 1',
    rewardPrice: 100,
  },
  {
    title: 'Task 2',
    description: 'Description of Task 2',
    rating: 5,
    category: 'youtube',
    duration: '1 hour',
    createdBy: 'User 1',
    rewardPrice: 100,
  },
  {
    title: 'Task 2',
    description: 'Description of Task 2',
    rating: 5,
    category: 'youtube',
    duration: '1 hour',
    createdBy: 'User 1',
    rewardPrice: 100,
  },
  {
    title: 'Task 2',
    description: 'Description of Task 2',
    rating: 5,
    category: 'youtube',
    duration: '1 hour',
    createdBy: 'User 1',
    rewardPrice: 100,
  },
  // Add more tasks as needed
];

const TasksPage: FC = () => {
  const [selectedTask, setSelectedTask] = useState<TaskData | null>(null);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const handleTaskClick = (task: TaskData) => {
    setSelectedTask(task);
  };

  const handleOpenAddTaskModal = () => {
    setIsAddTaskModalOpen(true);
  };

  const handleCloseAddTaskModal = () => {
    setIsAddTaskModalOpen(false);
  };

  const handleSubmitAddTask = (task: TaskData) => {
    // Handle adding the task (e.g., send API request, update state, etc.)
    console.log('New Task:', task);
  };

  return (
    <>
     <Nav/>
     <div className="flex"> 
      {/* <div className="w-1/4 border-r p-4">
        {/* Left navbar */}
        {/* <ul>
          <li>Profile</li>
          <li>Income</li>
          <li>Advertisement</li>
          <li>Payment</li>
          <li>Referral</li>
          <li>Contact</li>
          <li>Tasks</li>
          <li>About Us</li>
        </ul>
      </div>  */}
      <div className=" w-full p-4 bg-orange-300">
        {/* List of tasks */}
        <div className="grid row-auto gap-2">
          {mockTasks.map((task, index) => (
            <TaskCard key={index} {...task} onClick={() => handleTaskClick(task)} />
          ))}
        </div>
      </div>
      <div className="w-1/4 p-4 bg-purple-400 mt-3 rounded-md">
        {/* Task details */}
        <TaskDetails task={selectedTask} />
      </div>
      <button onClick={handleOpenAddTaskModal} className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        + Create New Task
      </button>
      <AddTaskModal isOpen={isAddTaskModalOpen} onClose={handleCloseAddTaskModal} onSubmit={handleSubmitAddTask} createdBy="" />
    </div>
  </>
  );
};

export default TasksPage;
