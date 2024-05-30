"use client";

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import profilepicDemo from "../../../public/rcb pic logo.jpeg";
import Nav from '@/components/Nav';

export default function Profile() {
  const router = useRouter();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(null);
  const [referredBy, setReferredBy] = useState<{ username: string, email: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // const token = localStorage.getItem('token'); // Adjust according to your auth logic
        const response = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const user = response.data.data;
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
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        console.error(error);
        setError('Failed to fetch user data');
      }
    };

    fetchUserProfile();
  }, [setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError('');
  setSuccess('');

  try {
    const response = await fetch('/api/updateProfile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const result = await response.json();
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
    <>
      <Nav />
      <div className="flex flex-col items-center mt-10">
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl">
          <h1 className="text-2xl font-bold mb-6 text-center">User Profile</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col md:flex-row">
              <div className="flex-grow mr-6">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Email:</label>
                    <input 
                      type="email" 
                      {...register('email', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your email address"
                    />
                    <button type="button" className="ml-2 text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-4 py-2">Verify email with OTP</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Username:</label>
                    <input 
                      type="text" 
                      {...register('username', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                    <input 
                      type="text" 
                      {...register('phoneNumber', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your phone number"
                    />
                    <button type="button" className="ml-2 text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-4 py-2">Verify phone number with OTP</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Gender:</label>
                    <select 
                      {...register('gender', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Age:</label>
                    <input 
                      type="number" 
                      {...register('age', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your age"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Payment Preference:</label>
                    <input 
                      type="text" 
                      {...register('paymentPreference', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your payment preference"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">Payment Gateway:</label>
                    <input 
                      type="text" 
                      {...register('paymentGateway', { required: true })} 
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                      placeholder="Enter your payment gateway"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center mt-6 md:mt-0">
                <div className="w-32 h-32 rounded-full overflow-hidden">
                  <Image 
                    src={profilePicture || profilepicDemo} 
                    alt="Profile Picture" 
                    className="object-cover w-full h-full" 
                    width={128}
                    height={128}
                  />
                </div>
                <button 
                  type="button" 
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" 
                  onClick={triggerFileInput}
                >
                  Change Profile Picture
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleProfilePictureChange} 
                  className="hidden" 
                />
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Referred By:</label>
                <input 
                  type="text" 
                  readOnly 
                  value={referredBy ? referredBy.email : 'No referral'} 
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                />
              </div>
              <button 
                type="submit" 
                className={`mt-4 w-full px-4 py-2 text-white rounded-md ${loading ? 'bg-gray-500' : 'bg-pink-700 hover:bg-pink-800'} focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
              {error && <div className="text-red-500 text-center mt-4">{error}</div>}
              {success && <div className="text-green-500 text-center mt-4">{success}</div>}
            </div>
          </form>
        </div>
      </div>
    </>
  );
}






























// Fetch user data and set form values
// Adjust based on your logic

// Fetch user data and set form values (commented out code for fetching user data)
              // You can uncomment and adjust based on your logic
              // if (session && session.user && session.user.email) {
                //   axios.get(`/api/next-auth/auth/getUser?email=${session.user.email}`)
                //     .then(response => {
                  //       const user = response.data.user;
                  //       setValue('userId', user._id);
              //       setValue('email', user.email);
              //       setValue('username', user.username);
              //       setValue('phoneNumber', user.phoneNumber);
              //       setValue('gender', user.gender);
              //       setValue('age', user.age);
              //       setValue('paymentPreference', user.paymentPreference);
              //       setValue('paymentGateway', user.paymentGateway);
              //       setValue('profilePicture', user.profilePicture);
              //     })
              //     .catch(err => {
              //       setError('Failed to fetch user data');
              //     });
              // }