import React from 'react';
import { TaskData } from '@/app/TaskFeed/page';
import axios from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from './ui/use-toast';
import { ITask } from "@/models/taskModel";

interface TaskCardProps extends ITask {
  onClick: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ _id, title, description, rating, category, status, createdAt, onClick }) => {

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(`/api/delete-task/${_id}`);
      toast({
        title: response.data.message
      });
      onClick(_id);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the task",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={() => onClick(_id)}>
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
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Created At: </span>
        {new Date(createdAt).toLocaleString()}
      </div>
      <button onClick={handleDeleteConfirm} className="text-red-600 mt-2">Delete</button>
    </div>
  );
};

export default TaskCard;
