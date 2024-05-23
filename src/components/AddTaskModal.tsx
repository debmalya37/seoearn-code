import React, { FC, useState } from 'react';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  createdBy: string; // Assuming the username or userId is provided as a prop
}

interface TaskData {
  title: string;
  description: string;
  rating: number;
  category: string;
  duration: string;
  createdBy: string;
  createdAt: string;
  rewardPrice: number;
}

const categoryOptions = [
  "Nothing is selected",
  "Registration only",
  "Registration with activity",
  "Activity only",
  "Bonuses",
  "YouTube",
  "Instagram",
  "Vkontakte",
  "FaceBook",
  "Telegram",
  "Other social networks",
  "Review/vote",
  "Posting",
  "Copyright, rewrite",
  "Captcha",
  "Transfer of points, credits",
  "Invest",
  "Forex",
  "Games",
  "Mobile Apps",
  "Downloading files",
  "Choose a referrer on SEOSPRINT",
  "Other"
];

const AddTaskModal: FC<AddTaskModalProps> = ({ isOpen, onClose, onSubmit, createdBy }) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    rating: 0,
    category: '',
    duration: '',
    createdBy: createdBy, // Set createdBy to the username or userId
    createdAt: new Date().toISOString(),
    rewardPrice: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTaskData({ ...taskData, category: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title:</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={taskData.title} 
                  onChange={handleChange} 
                  className="mt-1 p-2 block w-full border rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
                <textarea 
                  id="description" 
                  name="description" 
                  value={taskData.description} 
                  onChange={handleChange} 
                  className="mt-1 p-2 block w-full border rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating:</label>
                <input 
                  type="number" 
                  id="rating" 
                  name="rating" 
                  value={taskData.rating} 
                  onChange={handleChange} 
                  className="mt-1 p-2 block w-full border rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category:</label>
                <select 
                  id="category" 
                  name="category" 
                  value={taskData.category} 
                  onChange={handleCategoryChange} 
                  className="mt-1 p-2 block w-full border rounded-md"
                >
                  {categoryOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration:</label>
                <input 
                  type="text" 
                  id="duration" 
                  name="duration" 
                  value={taskData.duration} 
                  onChange={handleChange} 
                  className="mt-1 p-2 block w-full border rounded-md" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="createdBy" className="block text-sm font-medium text-gray-700">Created By:</label>
                <input 
                  type="text" 
                  id="createdBy" 
                  name="createdBy" 
                  value={taskData.createdBy} 
                  disabled 
                  className="mt-1 p-2 block w-full border rounded-md bg-gray-100" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="createdAt" className="block text-sm font-medium text-gray-700">Created At:</label>
                <input 
                  type="text" 
                  id="createdAt" 
                  name="createdAt" 
                  value={taskData.createdAt} 
                  disabled 
                  className="mt-1 p-2 block w-full border rounded-md bg-gray-100" 
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rewardPrice" className="block text-sm font-medium text-gray-700">Reward Price:</label>
                <input 
                  type="number" 
                  id="rewardPrice" 
                  name="rewardPrice" 
                  value={taskData.rewardPrice} 
                  onChange={handleChange} 
                  className="mt-1 p-2 block w-full border rounded-md" 
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;
