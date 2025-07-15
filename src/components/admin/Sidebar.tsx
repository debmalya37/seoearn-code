// src/components/admin/Sidebar.tsx
import Link from 'next/link';

const Sidebar = () => {
    return (
        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">
            <nav>
                <Link href="/Admin/Dashboard" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Dashboard
                </Link>
                <Link href="/Admin/Tasks" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Tasks
                </Link>
                <Link href="/Admin/Users" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Users
                </Link>
                <Link href="/Admin/revenue" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Revenue
                </Link>
                <Link href="/Admin/withdraw" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Withdrawl Requests
                </Link>
                 {/* <Link href="/Admin/kyc" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    User KYC verifications
                </Link>  */}


                {/* <Link href="/Admin/Settings" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    Settings
                </Link> */}
            </nav>
        </div>
    );
};

export default Sidebar;
