import Image from 'next/image';
import Link from 'next/link';
import pic from "../../../asset/1.png";
const Header = () => {
  return (
    <div className="flex items-center justify-between bg-white p-2 border border-gray-300 rounded mt-0 relative">
      <Image src={pic} alt="Logo" width={50} height={50} />
      <h5 className="m-0">SEO EARNING SPACE</h5>
      <div className="absolute right-0 flex space-x-2">
        <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
          Login
        </button>
        <button className="px-4 py-2 text-white bg-purple-700 rounded hover:bg-purple-800">
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Header;
