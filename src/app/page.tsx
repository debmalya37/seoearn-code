'use client';

import Nav from '@/components/Nav';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <>
    <div>
      <Nav/>
      {session ? (
        <div>Welcome, {session.user?.email}</div>
      ) : (

    <div className="min-h-screen bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 text-gray-900">
      <header className="py-6 bg-white shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="text-2xl font-bold text-purple-700">SEO EARN</div>
          <nav className="space-x-4">
            <Link href="/signin">
              <span className="text-lg text-pink-700 hover:text-purple-700">Sign In</span>
            </Link>
            <Link href="/signup">
              <span className="text-lg text-pink-700 hover:text-purple-700">Create an Account</span>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow py-20">
        <h1 className="text-5xl font-bold text-white mb-6 text-center">Welcome to SEO EARN</h1>
        <p className="text-lg text-white mb-12 text-center max-w-2xl">
          Join our platform where freelancers complete micro tasks and get paid, while advertisers get their tasks done efficiently. Grow your business with SEO EARN.
        </p>
        <div className="flex space-x-4">
          <Link href="/signin">
            <span className="px-6 py-3 bg-pink-700 text-white font-semibold rounded-md shadow-md hover:bg-pink-800 cursor-pointer">Sign In</span>
          </Link>
          <Link href="/signup">
            <span className="px-6 py-3 bg-purple-700 text-white font-semibold rounded-md shadow-md hover:bg-purple-800 cursor-pointer">Create an Account</span>
          </Link>
        </div>
      </main>

      <footer className="py-6 bg-white shadow-md">
        <div className="container mx-auto text-center text-gray-600">
          © 2024 SEO EARN. All rights reserved.
        </div>
      </footer>
    </div>
    )}
    </div>
  </>);
}
