import React from 'react';
import { TaskData } from '@/app/TaskFeed/page';

interface TaskCardProps extends TaskData {
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, description, rating, category, status, onClick }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={onClick}>
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Category: </span>
        {category}
      </div>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Status: </span>
        <span className={status === 'Completed' ? 'text-green-600' : status === 'Pending' ? 'text-red-600' : 'text-yellow-600'}>
          {status}
        </span>
      </div>
      <div className="mt-2 flex items-center">
        <span className="text-purple-700 font-bold">Rating: </span>
        <span className="ml-2">{rating} ⭐</span>
      </div>
    </div>
  );
};

export default TaskCard;
