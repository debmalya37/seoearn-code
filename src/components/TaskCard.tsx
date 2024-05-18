// components/Task.tsx

import React, { FC } from 'react';

interface TaskProps {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  rewardPrice: number;
  onClick: () => void;
}

const TaskCard: FC<TaskProps> = ({ title, description, rating, category, duration, createdBy, rewardPrice, onClick }) => {
  return (
    <div className="border rounded p-4 mb-4 cursor-pointer bg-pink-200" onClick={onClick}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-gray-600 mb-2">{description}</p>
      <p className="text-sm">Rating: {rating}</p>
      <p className="text-sm">Category: {category}</p>
      <p className="text-sm">Duration: {duration}</p>
      <p className="text-sm">Created by: {createdBy}</p>
      <p className="text-sm">Reward Price: {rewardPrice}</p>
    </div>
  );
};

export default TaskCard;
