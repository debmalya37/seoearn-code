import React from "react";
import { FaTasks, FaPlus } from "react-icons/fa";

interface AdsSideProps {
  onOpenNewTask?: () => void;
}

const AdsSide: React.FC<AdsSideProps> = ({ onOpenNewTask }) => {
  return (
    <div className="h-screen bg-gray-100 w-64 shadow-md flex flex-col">
      {/* Balance Section */}
      <div className="bg-blue-500 text-white p-4 text-center">
        <h3 className="text-lg font-bold">$ 0,0030</h3>
        <p className="text-sm">MY BALANCE</p>
      </div>
      <div className="bg-teal-500 text-white p-4 text-center">
        <h3 className="text-lg font-bold">$ 0,0000</h3>
        <p className="text-sm">MONEY IN SAFE</p>
      </div>

      {/* Menu Items */}
      <ul className="flex-grow p-4 space-y-2">
        <li className="flex items-center space-x-3 text-gray-700 hover:text-blue-500 hover:bg-gray-200 p-2 rounded cursor-pointer">
          <FaTasks className="text-lg" />
          <span>TASKS</span>
        </li>

        
        <li
          onClick={onOpenNewTask}
          className="flex items-center space-x-3 text-red-500 hover:bg-gray-200 p-2 rounded cursor-pointer"
        >
          <FaPlus className="text-lg" />
          <span>NEW TASK</span>
        </li>
      </ul>
    </div>
  );
};

export default AdsSide;
