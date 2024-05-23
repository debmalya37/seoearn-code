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
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
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
  }, [setValue]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/updateProfile', data);
      if (response.status === 200) {
        setSuccess('Profile updated successfully');
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      setError('Something went wrong. Please try again later.');
    }
    setLoading(false);
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
    <Nav/>
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
                  <label className="block text-sm font-medium text-gray-700">Phone Number:</label>
                  <input 
                    type="text" 
                    {...register('phoneNumber', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="+91"
                  />
                  <button type="button" className="ml-2 text-white bg-pink-700 hover:bg-pink-800 focus:ring-4 focus:outline-none focus:ring-pink-300 font-medium rounded-lg text-sm px-4 py-2">Verify mobile with OTP</button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name:</label>
                  <input 
                    type="text" 
                    {...register('username', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age:</label>
                  <input 
                    type="number" 
                    {...register('age', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Gender:</label>
                  <div className="mt-1">
                    <label className="inline-flex items-center">
                      <input 
                        type="radio" 
                        {...register('gender', { required: true })} 
                        value="male" 
                        className="form-radio"
                      />
                      <span className="ml-2">Male</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input 
                        type="radio" 
                        {...register('gender', { required: true })} 
                        value="female" 
                        className="form-radio"
                      />
                      <span className="ml-2">Female</span>
                    </label>
                    <label className="inline-flex items-center ml-6">
                      <input 
                        type="radio" 
                        {...register('gender', { required: true })} 
                        value="other" 
                        className="form-radio"
                      />
                      <span className="ml-2">Other</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date of Birth:</label>
                  <input 
                    type="date" 
                    {...register('dob', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment Reference:</label>
                  <input 
                    type="text" 
                    {...register('paymentPreference', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Payment ID:</label>
                  <input 
                    type="text" 
                    {...register('paymentGateway', { required: true })} 
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                  />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center">
                <Image
                  src={profilePicture ? profilePicture.toString() : {profilepicDemo} } // Placeholder for profile picture
                  alt="Profile" 
                  width={10}
                  height={10}
                  className="w-40 h-40 rounded-full object-cover mb-4"
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }} 
                  accept="image/*"
                  onChange={handleProfilePictureChange} 
                />
                <button 
                  type="button" 
                  onClick={triggerFileInput} 
                  className="text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
          {error && <div className="text-red-600">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
          <div className="flex justify-between mt-6">
            <button 
              type="button" 
              className="bg-gray-200 text-gray-700 py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-pink-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
    );
}
