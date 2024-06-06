import { useEffect, useState } from 'react';
import axios from 'axios';

export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        setUser(response.data.user);
      } catch (error) {
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    window.location.href = '/login';
  };

  return { user, logout };
};
