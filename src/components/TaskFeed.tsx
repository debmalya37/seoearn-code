import { useState, useEffect } from 'react';
import axios from 'axios';
import { Task } from '../types/index'; // Adjust the path as needed

const TaskFeed = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<{ data: Task[] }>('/api/tasks');
        setTasks(response.data.data);
      } catch (error) {
        console.error('Error fetching tasks', error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div>
      <h1>Task Feed</h1>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <h2>{task.title}</h2>
            <p>{task.description}</p>
            {task.reward && <p>Reward: {task.reward}</p>}
            {task.rating && <p>Rating: {task.rating}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskFeed;
