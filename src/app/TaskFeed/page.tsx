"use client";
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
  reward: number;
  status: string;
}

const mockTasks: TaskData[] = [
  {
    title: 'Task 1',
    description: 'Web development code this website and deploy the website of a food delivery quick commerce.',
    rating: 4,
    category: 'Web Development',
    duration: '1 week',
    createdBy: 'username',
    reward: 100,
    status: 'Pending',
  },
  {
    title: 'web development task',
    description: 'Web development code this website and deploy the website of a food delivery quick commerce.',
    rating: 3,
    category: 'Web Development',
    duration: '1 week',
    createdBy: 'username',
    reward: 100,
    status: 'Pending',
  },
  {
    title: 'watch videos',
    description: 'watch netflix and run from the bed room and code this website and deploy the website of a food delivery quick commerce.',
    rating: 3,
    category: 'Web Development',
    duration: '1 week',
    createdBy: 'username',
    reward: 100,
    status: 'Pending',
  },
  {
    title: 'game play task',
    description: 'play games and enjoy the evening.',
    rating: 3,
    category: 'Web Development',
    duration: '1 week',
    createdBy: 'username',
    reward: 100,
    status: 'Pending',
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
      {/* <div className='flex justify-between w-full items-center'> */}

      <Nav/>
        {/* </div> */}
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-1/5 bg-yellow-100 p-4 flex flex-col justify-between ">
          <div className='fixed'>
            <div className="text-xl font-bold mb-6">Username</div>
            <nav className="space-y-4">
              <a href="#" className="block">Advertisement</a>
              <a href="#" className="block">Income</a>
              <a href="#" className="block">Referral</a>
              <a href="#" className="block">Task</a>
              <a href="#" className="block">Payment</a>
              <a href="#" className="block">Contact & Support</a>
              <a href="#" className="block">Status</a>
              <a href="#" className="block">About Us</a>
            </nav>
          <button className="bg-orange-400 text-white py-2 px-4 rounded-md">Sign Out</button>
          </div>
        </div>

        {/* Task List */}
        <div className="w-3/5 bg-purple-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">All Tasks</h1>
            <input type="text" placeholder="search" className="border rounded-md py-2 px-4" />
          </div>
          <div className="space-y-4">
            {mockTasks.map((task, index) => (
              <TaskCard key={index} {...task} onClick={() => handleTaskClick(task)} />
            ))}
          </div>
          <div className="flex justify-between items-center mt-4 pb-6">
            <button className="text-purple-700">Previous</button>
            <div className="space-x-2">
              <button className="text-purple-700">1</button>
              <button className="text-purple-700">2</button>
              <button className="text-purple-700">3</button>
              <button className="text-purple-700">4</button>
              <button className="text-purple-700">5</button>
              <button className="text-purple-700">6</button>
              <button className="text-purple-700">7</button>
            </div>
            <button className="text-purple-700">Next</button>
          </div>
        </div>

        {/* Task Details */}
        <div className="w-2/5 bg-yellow-50 p-4">
          <TaskDetails task={selectedTask} />
        </div>

        <button
          onClick={handleOpenAddTaskModal}
          className="fixed bottom-4 right-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Add New Task
        </button>
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={handleCloseAddTaskModal}
          onSubmit={handleSubmitAddTask}
          createdBy=""
        />
      </div>
    </>
  );
};

export default TasksPage;
