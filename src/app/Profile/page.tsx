"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import profilepicDemo from "../../../public/rcb pic logo.jpeg";

const Profile = () => {
  const { data: session, status } = useSession();
  const { register, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | ArrayBuffer | null>(profilepicDemo);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/profile`);
      setValue('Profile', response.data.loading);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('/api/profile');
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
          setReferralCode(user.referralCode);
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
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post('/api/profile', data);

      if (response.status !== 200) {
        throw new Error(`Error: ${response.statusText}`);
      }

      setSuccess('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
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

  const copyReferralLink = () => {
    if (referralCode) {
      const referralLink = `${window.location.origin}/sign-up?ref=${referralCode}`;
      navigator.clipboard.writeText(referralLink).then(() => {
        setSuccess('Referral link copied to clipboard');
      }, (err) => {
        setError('Failed to copy referral link');
      });
    }
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (status === 'unauthenticated') {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="flex flex-col items-center mt-0 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-400">
      <div className="bg-gradient-to-r from-pink-100 via-orange-200 to-pink-300 rounded-lg shadow-2xl p-8 w-full max-w-4xl mt-10 mb-5">
        <h1 className="text-3xl font-bold mb-8 text-center">User Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex-grow mb-6 md:mb-0 md:mr-6">
              <div className="flex flex-col space-y-4">
                <label className="block">
                  <span className="text-gray-800">Email</span>
                  <input
                    type="email"
                    className="form-input mt-1 block w-full"
                    {...register('email')}
                    disabled
                  />
                </label>
                <label className="block">
                  <span className="text-gray-800">Username</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('username')}
                    disabled
                  />
                </label>
                <label className="block">
                  <span className="text-gray-800">Phone Number</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('phoneNumber')}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Gender</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('gender')}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Age</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('age')}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Payment Preference</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
                    {...register('paymentPreference')}
                  />
                </label>
                <label className="block">
                  <span className="text-gray-700">Payment Gateway</span>
                  <input
                    type="text"
                    className="form-input mt-1 block w-full"
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300"
              >
                Change Picture
              </button>
            </div>
          </div>
          {referralCode && (
            <div className="flex flex-col items-center mt-6">
              <p className="text-gray-800 mb-2">Referral Link:</p>
              <div className="flex items-center">
                <input
                  type="text"
                  className="form-input mt-1 block w-full"
                  value={`${window.location.origin}/sign-up?ref=${referralCode}`}
                  readOnly
                />
                <button
                  type="button"
                  onClick={copyReferralLink}
                  className="ml-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
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
      </div>
    </div>
  );
};

export default Profile;
