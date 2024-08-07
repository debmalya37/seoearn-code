import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter from next/navigation
import { ITask } from "@src/models/taskModel";
import { toast } from './ui/use-toast';

interface TaskCardProps {
  id: string; // Add id prop for navigation
  title: string;
  description: string;
  rating: number;
  category: string;
  status: string;
  createdAt: Date;
}

const TaskCard: React.FC<TaskCardProps> = ({ id, title, description, rating, category, status, createdAt }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter(); // Initialize useRouter

  const handleReadMore = () => {
    router.push(`/taskfeed/${id}`); // Navigate to the task details page
  };

  const shortDescription = description.length > 100 ? description.substring(0, 100) + "..." : description; // Limit the description length

  return (
    <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">
        {isExpanded ? description : shortDescription}
        {description.length > 100 && (
          <button type='button'
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 ml-2"
          >
            {isExpanded ? "Read Less" : "Read More"}
          </button>
        )}
      </p>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Category: </span>
        {category}
      </div>
      <div className="mt-2">
        <span className="text-purple-700 font-bold">Status: </span>
        <span className={status === 'Approved' ? 'text-green-600' : status === 'Pending' ? 'text-red-600' : status==="In Progress" ? 'text-yellow-600': "text-grey-500"}>
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
      <button
        onClick={handleReadMore}
        className="text-blue-600 mt-2"
      >
        View Details
      </button>
    </div>
    
  );
};

export default TaskCard;
