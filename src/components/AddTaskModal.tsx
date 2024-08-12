import React, { FC, useState } from 'react';
import { TaskData } from '@src/types/task';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: TaskData) => void;
  createdBy: string; // Assuming the username or userId is provided as a prop
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
    reward: 0,
    status: 'Pending', // Default status value
    is18Plus: false, // Default value for is18Plus
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTaskData({ ...taskData, category: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setTaskData({ ...taskData, is18Plus: checked });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(taskData);
    onClose();
  };

  // Return part
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">Add New Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="rating" className="block mb-1">Rating:</label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={taskData.rating}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                  min="0"
                  max="10" // Limit the rating to a maximum of 10
                />
              </div>
              <div className="mb-4">
                <label htmlFor="category" className="block mb-1">Category:</label>
                <select
                  id="category"
                  name="category"
                  value={taskData.category}
                  onChange={handleCategoryChange}
                  className="border p-2 w-full"
                  required
                >
                  {categoryOptions.map((option, index) => (
                    <option key={index} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="duration" className="block mb-1">Duration:</label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={taskData.duration}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="reward" className="block mb-1">Reward:</label>
                <input
                  type="number"
                  id="reward"
                  name="reward"
                  value={taskData.reward}
                  onChange={handleChange}
                  className="border p-2 w-full"
                  required
                  min="0"
                />
              </div>
              <div className="mb-4">
                <input
                  type="checkbox"
                  id="is18Plus"
                  name="is18Plus"
                  checked={taskData.is18Plus}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="is18Plus">18+ Task</label>
              </div>
              {/* Status field is removed to make it non-editable */}
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Create Task
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddTaskModal;
