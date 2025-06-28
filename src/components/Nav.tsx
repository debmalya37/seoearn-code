"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import Image from "next/image";
import LanguageToggle from "./LanguageToggle";
import { BsMegaphoneFill } from "react-icons/bs";
import {
  FaDollarSign,
  FaBullhorn,
  FaCoffee,
  FaEnvelope,
  FaUsers,
  FaUserCog,
  FaLandmark,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import pic from "../../asset/1.png";
import NotificationBell from "./NotificationBell";

const Nav = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;
  const username = user?.email?.split("@")[0];
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      
      
      {/* Toggle Button (always visible in the top-left corner) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-2 left-2 z-50 p-2 bg-green-700 rounded-md flex items-center justify-center transition-transform duration-300"
      >
        {isOpen ? (
          <FaChevronLeft className="text-white w-5 h-5" />
        ) : (
          <FaChevronRight className="text-white w-5 h-5" />
        )}
      </button>

      {isOpen && (
        <>

              


        <div className="h-screen w-64 bg-green-900 text-white flex flex-col items-center py-6">

        <div className="flex absolute items-right justify-right ml-40 mt-4">
                      <NotificationBell />
              </div>
          {/* Profile Picture */}
          <div className="mb-6">
            <Image
              src={pic}
              alt="User Profile"
              width={70}
              height={70}
              className="rounded-full border-2 border-white"
            />

          </div>
        <LanguageToggle />
        
          {/* Menu Items */}
          <ul className="space-y-4 w-full px-4">
            <li>
              <Link
                href="/Wallet"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <FaDollarSign className="mr-3" />
                Income
              </Link>
            </li>
            <li>
              
            </li>
            <li>
              <Link
                href="/TaskFeed"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <FaCoffee className="mr-3" />
                Feed
              </Link>
            </li>
            <li>
              {/* <Link
                href="/Messages"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <FaEnvelope className="mr-3" />
                Messages
              </Link> */}
            </li>
            <li>
              <Link
                href="/referrals"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <FaUsers className="mr-3" />
                Referrals
              </Link>
            </li>
            <li>
              <Link
                href="/Profile"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <FaUserCog className="mr-3" />
                My Profile
              </Link>
            </li>
            <li>
              <Link
                href="/CreateAdvertisement"
                className="flex items-center text-white hover:bg-green-700 px-4 py-2 rounded transition-colors duration-200"
              >
                <BsMegaphoneFill  className="mr-3" />
                Ads Management
              </Link>
            </li>
          </ul>

          {/* Sign Out Button */}
          {session && (
            <button
              onClick={() => signOut()}
              className="mt-auto mb-6 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors duration-200"
            >
              Sign Out
            </button>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default Nav;
