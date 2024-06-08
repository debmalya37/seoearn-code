"use client"
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import pic from "../../asset/1.png";
import Image from "next/image";
const Nav =  () => {
  const {data: session } = useSession()
  const user: User = session?.user as User
  return (
    
    <header className="bg-pink-700 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <Image src={pic} alt="Logo" width={70} height={70} />
        {
          session ? (
          <>
            <span className="">Welcome, {user?.username || user?.email }</span>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="w-full md:w-auto">SignIn</Button>
            </Link>
          )
        }
        <div className="flex gap-10 ml-2">
          <Link href="/">Home</Link>
          <Link href="/TaskFeed">TaskFeed</Link>
          <Link href="/CreateAdvertisement">Advertisement</Link>
          <Link href="/Payment">Payment</Link>
          <Link href="/Referral">Referral</Link>
          <Link href="/Profile">Profile</Link>
          
          {/* You can add more links here */}
          
        </div>
      </nav>
    </header>
    
  );
};

export default Nav;
