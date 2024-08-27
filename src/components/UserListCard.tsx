// src/components/UserListCard.tsx
"use client";
import React from "react";

// src/components/UserListCard.tsx
interface UserListCardProps {
    id: string;
    name: string;
    username: string;
    email: string;
    age: number;
    gender: string;
    isVerified: boolean;
  }
  
  const UserListCard: React.FC<UserListCardProps> = ({
    id,
    name,
    username,
    email,
    age,
    gender,
    isVerified
}) => {
    return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center border-b border-gray-300">
        <span className="flex-1 text-center">{username}</span>
        <span className="flex-1 text-center">{name}</span>
        <span className="flex-1 text-center">{email}</span>
        <span className="flex-1 text-center">{age}</span>
        <span className="flex-1 text-center">{gender}</span>
        <span className="flex-1 text-center">{isVerified ? "Yes" : "No"}</span>
    </div>
    );
};

    export default UserListCard;

