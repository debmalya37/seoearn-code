import React, { useState, useEffect } from 'react';

const users = [
  { id: 1, name: 'User One', email: 'userone@example.com', rating: 0 },
  { id: 2, name: 'User Two', email: 'usertwo@example.com', rating: 0 },
  // Add more users as needed
];

const UserList: React.FC<{ onViewUser: (user: any) => void }> = ({ onViewUser }) => {
  const [userList, setUserList] = useState(users);

  const handleDeleteUser = (id: number) => {
    setUserList(userList.filter(user => user.id !== id));
  };

  const handleRatingChange = (id: number, rating: number) => {
    setUserList(userList.map(user => user.id === id ? { ...user, rating } : user));
  };

  const renderStars = (rating: number, onChange: (newRating: number) => void) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <span
                key={index}
                className={`cursor-pointer text-3xl ${index < rating ? 'text-yellow-500' : 'text-black'}`}
                onClick={() => onChange(index + 1)}
              >
                ★
              </span>
        ))}
      </div>
    );
  };

  useEffect(() => {
    // Update user rating logic here if needed
  }, [userList]);

  return (
    <div className="user-list">
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Rating</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userList.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">
                <button onClick={() => onViewUser(user)} className="text-blue-500">
                  {user.name}
                </button>
              </td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {renderStars(user.rating, rating => handleRatingChange(user.id, rating))}
              </td>
              <td className="py-2 px-4 border-b">
                <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
