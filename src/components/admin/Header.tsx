"use client";

import React from 'react';
import { useSession } from 'next-auth/react'; // Adjust according to your session management
import Link from 'next/link';

const Header = () => {
    const { data: session } = useSession();
    const user = session?.user.username
    return (
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
            <div className="text-xl font-semibold">Dashboard</div>
            <div className="flex items-center space-x-4">
                {/* <div>Notifications</div> */}
                {session?.user?.email ? (
                    <Link href={`/u/${user}`}>
                        <span className="text-blue-600 hover:underline">{user}</span>
                    </Link>
                ) : (
                    <div>User Profile</div>
                )}
            </div>
        </header>
    );
};

export default Header;
