import React from "react";
import Link from "next/link";


const Nav =  () => {
  return (
    <header className="bg-pink-700 text-gray-100">
      <nav className="flex justify-between items-center w-full px-10 py-4">
        <div className="flex-ml-1">LOGO(seo)</div>
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
