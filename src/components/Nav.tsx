import React from "react";
import Link from "next/link";
import {getServerSession} from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

const Nav = async () => {

  const session = await getServerSession(options);
  return (
    <header className="bg-pink-700 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div className="flex-ml-1">LOGO(seo)</div>
        <div className="flex gap-10 ml-2">
          <Link href="/">Home</Link>
          <Link href="/TaskFeed">TaskFeed</Link>
          <Link href="/CreateAdvertisement">Create Advertisement</Link>
          <Link href="/ClientMember">Referral</Link>
          <Link href="/Member">Profile</Link>
          {/* You can add more links here */}
          {session? (<Link href="api/auth/signout?callbackUrl=/">Log Out</Link>)
          :
          (<Link href="api/auth/signin">Log In</Link>)
        }
        </div>
      </nav>
    </header>
  );
};

export default Nav;
