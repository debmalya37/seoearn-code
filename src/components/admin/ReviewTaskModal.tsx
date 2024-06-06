import React from 'react';

interface ReviewTaskModalProps {
  task: {
    id: number;
    name: string;
    time: string;
    earning: number;
    status: string;
  };
  onClose: () => void;
  onUpdateStatus: (status: string) => void;
}

const ReviewTaskModal: React.FC<ReviewTaskModalProps> = ({ task, onClose, onUpdateStatus }) => {
  const [status, setStatus] = React.useState(task.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  };

  const handleUpdateStatus = () => {
    onUpdateStatus(status);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Review Task</h2>
        <p className="mb-4">Task: {task.name}</p>
        <p className="mb-4">Time: {task.time}</p>
        <p className="mb-4">Earning: ${task.earning}</p>
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="status"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={status}
            onChange={handleStatusChange}
          >
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleUpdateStatus}
        >
          Update Status
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReviewTaskModal;
