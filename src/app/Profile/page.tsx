"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Profile from '@/components/Profile';

interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  profilePicture?: string;
  paymentPreference: string;
  paymentGateway: string;
}

const UserProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get('/api/profile', {
          headers: {
            Authorization: 'your-auth-token-here', // replace with actual token
          },
        });
        setUser(res.data.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>No user data</div>;

  return <Profile user={user} />;
};

export default UserProfilePage;
