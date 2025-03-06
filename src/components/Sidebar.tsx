import { FaWallet, FaHandHoldingUsd, FaHistory, FaUser, FaCreditCard, FaCog, FaBell, FaStar, FaFileAlt, FaLink } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-gray-200 shadow-md flex flex-col">
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
      <div className="flex-1 p-4">
        <ul className="space-y-4">
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaWallet className="mr-3" />
            MY WALL
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaLink className="mr-3" />
            MY REF LINK
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaStar className="mr-3" />
            PREMIUM ACCOUNT
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaHistory className="mr-3" />
            OPERATIONS HISTORY
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaUser className="mr-3" />
            ACCOUNT DATA
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaCreditCard className="mr-3" />
            PAYMENT DETAILS
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaFileAlt className="mr-3" />
            FORM
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaCog className="mr-3" />
            SETTINGS
          </li>
          <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaBell className="mr-3" />
            NOTIFICATIONS
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
