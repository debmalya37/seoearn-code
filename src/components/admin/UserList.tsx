import React from 'react';
import { FaStar } from 'react-icons/fa';

interface User {
  id: number;
  name: string;
  email: string;
  rating: number;
}

interface UserListProps {
  users: User[];
  onRateUser: (id: number, rating: number) => void;
  onDeleteUser: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onRateUser, onDeleteUser }) => {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <table className="w-full text-left">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Rating</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={20}
                    color={i < user.rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => onRateUser(user.id, i + 1)}
                    className="cursor-pointer"
                  />
                ))}
              </td>
              <td>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => onDeleteUser(user.id)}
                >
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
