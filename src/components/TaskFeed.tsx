import { useState, useEffect } from 'react';
import axios from 'axios';

const TaskFeed = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks');
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
            <p>{task.}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskFeed;
