import React from 'react';

interface Task {
  id: number;
  name: string;
  email:string;
  time: string;
  earning: number;
  status: string;
  is18Plus: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onReviewTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onReviewTask, onDeleteTask }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Tasks</th>
            <th>owner email</th>
            <th>Time takes to Complete</th>
            <th>Earning</th>
            <th>Review / Delete</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.name}</td>
              <td>{task.email}</td>
              <td>{task.time}</td>
              <td>{task.status}</td>
              <td>${task.earning}</td>
              <td>${task.is18Plus}</td>
              <td>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => onReviewTask(task.id)}
                >
                  Review
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => onDeleteTask(task.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
