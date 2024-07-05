"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from './ui/use-toast';
import { ITask } from "@/models/taskModel";

interface TaskCardProps extends ITask {
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ _id, title, description, rating, category, createdAt, onClick }) => {
  const [taskStats, setTaskStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats');
        const data = await res.json();
        setTaskStats(data);
      } catch (error) {
        console.error('Error fetching task stats:', error);
      }
    };
    fetchStats();
  }, []);

  const tasksPipeLine = taskStats ? taskStats.tasksPipeLine : {};

  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => onClick(_id)}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Category: </span>
        {tasksPipeLine.category}
      </div>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Status: </span>
        <span className={tasksPipeLine.status === 'Completed' ? 'text-green-600' : tasksPipeLine.status === 'Pending' ? 'text-red-600' : 'text-yellow-600'}>
          {tasksPipeLine.status}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-purple-700 font-bold">Rating: </span>
        <span className="ml-2">{tasksPipeLine.rating} ⭐</span>
      </div>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Created At: </span>
        {new Date(tasksPipeLine.createdAt).toLocaleString()}
      </div>
      {/* <button onClick={handleDeleteConfirm} className="text-red-600 mt-2">Delete</button> */}
    </div>
  );
};

export default TaskCard;
