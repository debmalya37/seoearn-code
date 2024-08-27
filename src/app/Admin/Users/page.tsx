// src/app/Admin/Users/page.tsx
import Sidebar from "@src/components/admin/Sidebar";
import UserListCard from "@src/components/UserListCard";
import { fetchUsers } from "@src/actions/useractions"; // Import the server action

interface IUserCard {
  _id: string;
  username: string;
  name: string;
  email: string;
  age: number;
  gender: string;
  isVerified: boolean;
}

export default async function UsersPage() {
  const users: IUserCard[] = await fetchUsers(); // Use the server action

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      <Sidebar />
      <div className="w-full max-w-screen-lg mx-auto space-y-2">
        {/* Header Row */}
        <div className="bg-gray-200 p-2 rounded-lg shadow-md flex items-center border-b border-gray-300 font-medium text-gray-700">
          <span className="flex-1 text-center">Username</span>
          <span className="flex-1 text-center">Name</span>
          <span className="flex-1 text-center">Email</span>
          <span className="flex-1 text-center">Age</span>
          <span className="flex-1 text-center">Gender</span>
          <span className="flex-1 text-center">Verified</span>
        </div>

        {/* User List */}
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <UserListCard
              key={user._id}
              id={user._id}
              name={user.name}
              username={user.username}
              email={user.email}
              age={user.age}
              gender={user.gender}
              isVerified={user.isVerified}
            />
          ))
        ) : (
          <div className="text-center">No users available</div>
        )}
      </div>
    </div>
  );
}
