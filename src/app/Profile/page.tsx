// ProfilePage.tsx
"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import profilepicDemo from "../../../public/rcb pic logo.jpeg";

export default function Profile() {
  const { data: session } = useSession();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(profilepicDemo);
  const [referredBy, setReferredBy] = useState<{ username: string, email: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/getProfile');
        if (response.status === 200) {
          const user = response.data.user;
          setValue('email', user.email);
          setValue('username', user.username);
          setValue('phoneNumber', user.phoneNumber);
          setValue('gender', user.gender);
          setValue('age', user.age);
          setValue('paymentPreference', user.paymentPreference);
          setValue('paymentGateway', user.paymentGateway);
          setValue('profilePicture', user.profilePicture);
          if (user.referredBy) {
            setReferredBy(user.referredBy);
          }
          setProfilePicture(user.profilePicture || profilepicDemo);
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch user data');
      }
    };

    if (session) {
      fetchUserProfile();
    }
  }, [setValue, session]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.patch('/api/updateProfile', data);

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccess('Profile updated successfully');
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex-grow mr-6">
              <div className="flex flex-col space-y-4">
                <label>
                  Email
                  <input
                    type="email"
                    className="form-input mt-1"
                    {...register('email')}
                    disabled
                  />
                </label>
                <label>
                  Username
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('username')}
                    disabled
                  />
                </label>
                <label>
                  Phone Number
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('phoneNumber')}
                  />
                </label>
                <label>
                  Gender
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('gender')}
                  />
                </label>
                <label>
                  Age
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('age')}
                  />
                </label>
                <label>
                  Payment Preference
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('paymentPreference')}
                  />
                </label>
                <label>
                  Payment Gateway
                  <input
                    type="text"
                    className="form-input mt-1"
                    {...register('paymentGateway')}
                  />
                </label>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={typeof profilePicture === 'string' ? profilePicture : profilepicDemo}
                  alt="Profile Picture"
                  className="rounded-full object-cover"
                  fill
                />
              </div>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleProfilePictureChange}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="px-4 py-2 bg-blue-500 text-white rounded-md"
              >
                Change Picture
              </button>
            </div>
          </div>
          <div className="text-center">
            <button
              type="submit"
              className={`px-6 py-2 rounded-md text-white ${loading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
            {error && <div className="text-red-500 text-center mt-4">{error}</div>}
            {success && <div className="text-green-500 text-center mt-4">{success}</div>}
          </div>
        </form>
        {referredBy && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Referred By</h2>
            <p><strong>Username:</strong> {referredBy.username}</p>
            <p><strong>Email:</strong> {referredBy.email}</p>
          </div>
        )}
      </div>
    </div>
  );
}
