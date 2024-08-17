"use client"
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import pic from "../../asset/1.png";
import Image from "next/image";

const Nav =  () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const username = user?.email?.split('@')[0];

  return (
    <header className="bg-pink-700 text-gray-100 shadow-lg">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <Image src={pic} alt="Logo" width={70} height={70} />
        {
          session ? (
          <>
            <div className="relative">
              <span className="flex items-center"> WELCOME! </span>
              <button 
                onClick={handleDropdownToggle} 
                className="flex items-center text-gray-100 bg-sky-950 rounded-md p-3 hover:bg-sky-800 transition-colors duration-200"
              >
                
                <span className="mr-2">{username || user?.email}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black border border-gray-300 rounded shadow-lg z-10">
                  <Link href={`/u/${username}`} className="block px-4 py-2 hover:bg-gray-100 transition-colors duration-200">
                    View Profile
                  </Link>
                  <Button 
                    onClick={() => signOut()}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto bg-sky-950 hover:bg-sky-800 text-gray-100 transition-colors duration-200">Sign In</Button>
            </Link>
          )
        }
        <div className="flex gap-6 ml-2">
          <Link href="/" className="text-orange-300 hover:text-white transition-colors duration-200">Home</Link>
          <Link href="/TaskFeed" className="text-orange-300 hover:text-white transition-colors duration-200">TaskFeed</Link>
          <Link href="/CreateAdvertisement" className="text-orange-300 hover:text-white transition-colors duration-200">Advertisement</Link>
          <Link href="/Payment" className="text-orange-300 hover:text-white transition-colors duration-200">Payment</Link>
          <Link href="/Referral" className="text-orange-300 hover:text-white transition-colors duration-200">Referral</Link>
          <Link href="/Profile" className="text-orange-300 hover:text-white transition-colors duration-200">Profile</Link>
        </div>
      </nav>
    </header>
  );
};

export default Nav;
