import React, { useState, useEffect } from 'react';

const ReviewTaskModal: React.FC<{ task: any, onClose: () => void, onUpdateTask: (updatedTask: any) => void }> = ({ task, onClose, onUpdateTask }) => {
  const [status, setStatus] = useState(task.status);
  const [rating, setRating] = useState(task.rating);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleStarClick = (index: number) => {
    setRating(index + 1);
  };

  const handleUpdateTask = () => {
    const updatedTask = { ...task, status, rating };
    onUpdateTask(updatedTask);
  };

  useEffect(() => {
    setStatus(task.status);
    setRating(task.rating);
  }, [task]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-1/2">
        <h2 className="text-2xl font-bold mb-4">Review Task</h2>
        <p><strong>Task Title:</strong> {task.name}</p>
        <p><strong>Description:</strong> {task.description}</p>
        <p><strong>Created At:</strong> {task.createdAt}</p>
        <p><strong>Created By:</strong> {task.createdBy}</p>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Status</label>
          <select value={status} onChange={handleStatusChange} className="p-2 border rounded w-full">
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Rating</label>
          <div className="flex">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`cursor-pointer text-3xl ${index < rating ? 'text-yellow-500' : 'text-black'}`}
                onClick={() => handleStarClick(index)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <button onClick={handleUpdateTask} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
          Update
        </button>
        <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
};

export default ReviewTaskModal;
