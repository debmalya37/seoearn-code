import Image from 'next/image';
import React from 'react';

interface UserProfileProps {
  user: {
    _id: string;
    username: string;
    email: string;
    phoneNumber: string;
    gender: string;
    age: number;
    profilePicture?: string;
    paymentPreference: string;
    paymentGateway: string;
  };
}

const Profile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className="container mx-auto p-4">
      <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">User Profile</h1>
        <div className="mb-4">
          <Image src={user.profilePicture || '/default-profile.png'} alt="Profile" className="w-32 h-32 rounded-full mx-auto" />
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Username:</h2>
          <p>{user.username}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Email:</h2>
          <p>{user.email}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Phone Number:</h2>
          <p>{user.phoneNumber}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Gender:</h2>
          <p>{user.gender}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Age:</h2>
          <p>{user.age}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Payment Preference:</h2>
          <p>{user.paymentPreference}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Payment Gateway:</h2>
          <p>{user.paymentGateway}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
