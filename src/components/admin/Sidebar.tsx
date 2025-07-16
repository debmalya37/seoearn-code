// src/components/admin/Sidebar.tsx

"use client";
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const Sidebar = () => {


    const { data: session } = useSession();

    if (
        !session ||
         ![ 
          'debmalyasen37@gmail.com',
          'souvik007b@gmail.com',
          'sb@gmail.com',
          'seoearningspace@gmail.com',
          'yashverdhan01@gamil.com',
          'debmalyasen15@gmail.com',
          'test@gmail.com'
        ].includes(session.user!.email!)
      ) {
        return (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Access Denied</h1>
              <p className="mt-4">Please sign in as an admin to view this dashboard.</p>
              <Link href="/sign-in">
                <span className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        );
      }
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
                <Link href="/Admin/tickets" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700">
                    User Rasied Tickets
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
