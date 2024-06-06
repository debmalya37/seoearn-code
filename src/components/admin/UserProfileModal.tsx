"use client";

import React, { useEffect, useState } from 'react';

const UserProfileModal: React.FC<{ user: any, onClose: () => void }> = ({ user, onClose }) => {
    const [rating, setRating] = useState(user.rating);
    const handleStarClick = (index: number) => {
        setRating(index + 1);
      };

      useEffect(() => {
      
        setRating(user.rating);
      }, [user]);
    return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg w-1/3">
        <h2 className="text-xl font-bold mb-4">User Profile: {user.name}</h2>
        <p className="mb-4"><strong>Name:</strong> {user.name}</p>
        <p className="mb-4"><strong>Email:</strong> {user.email}</p>
        <p className="mb-4"><strong>Rating:</strong></p>
        <div className="flex mb-4">
          {[...Array(5)].map((_, index) => (
            <span
            key={index}
            className={`cursor-pointer text-3xl ${index < rating ? 'text-yellow-500' : 'text-black'}`}
            onClick={() => handleStarClick(index)}
          >
            ★
          </span>
          ))}
        </div>
        <div className="flex justify-end">
          <button onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
