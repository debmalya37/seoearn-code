import React from 'react';
import { TaskData } from '@/app/TaskFeed/page';

interface TaskDetailsProps {
  task: TaskData | null;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task }) => {
  if (!task) {
    return <div className="text-center text-gray-500">Select a task to see the details</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <h2 className="text-xl font-bold mb-2">{task.title}</h2>
      <p className="text-gray-600 mb-2">{task.description}</p>
      <div className="mb-2">
        <span className="text-purple-700 font-bold">Category: </span>
        {task.category}
      </div>
      <div className="mb-2">
        <span className="text-purple-700 font-bold">Duration: </span>
        {task.duration}
      </div>
      <div className="mb-2">
        <span className="text-purple-700 font-bold">Created By: </span>
        {task.createdBy}
      </div>
      <div className="mb-2">
        <span className="text-purple-700 font-bold">Reward: </span>
        ${task.reward}
      </div>
      <div className="mt-4">
        <button className="bg-orange-400 text-white py-2 px-4 rounded-md">Details</button>
      </div>
    </div>
  );
};

export default TaskDetails;
