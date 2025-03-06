import { FaWallet, FaHandHoldingUsd, FaHistory, FaUser, FaCreditCard, FaCog, FaBell, FaStar, FaFileAlt, FaLink } from 'react-icons/fa';

const Feedside = () => {
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
          {/* <li className="flex items-center text-gray-700 hover:text-blue-500 cursor-pointer">
            <FaStar className="mr-3" />
            My Blogs
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Feedside;
