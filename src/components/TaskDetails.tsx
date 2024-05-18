// components/TaskDetails.tsx

import React, { FC } from 'react';

interface TaskDetailsProps {
  task: {
    title: string;
    description: string;
    rating: number;
    category: string;
    duration: string;
    createdBy: string;
    rewardPrice: number;
  } | null;
}

const TaskDetails: FC<TaskDetailsProps> = ({ task }) => {
  return (
    <div className="border rounded p-4">
      {task ? (
        <>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
          <p className="text-sm">Rating: {task.rating}</p>
          <p className="text-sm">Category: {task.category}</p>
          <p className="text-sm">Duration: {task.duration}</p>
          <p className="text-sm">Created by: {task.createdBy}</p>
          <p className="text-sm">Reward Price: {task.rewardPrice}</p>
        </>
      ) : (
        <p className="text-sm">Select a task to view details</p>
      )}
    </div>
  );
};

export default TaskDetails;
