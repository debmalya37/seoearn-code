// src/app/page.tsx

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
    <div className="flex flex-col min-h-screen">
      <Nav />
      {session ? (
        <div className="flex-grow flex items-center justify-center text-gray-800">
          <div>Welcome, {session.user?.email}</div>
        </div>
      ) : (
        <div className="flex flex-col flex-grow">
          <header className="py-6 bg-white shadow-md">
            <div className="container mx-auto flex justify-between items-center px-6">
              <div className="text-2xl font-bold text-purple-700">SEO EARN</div>
              <nav className="space-x-4">
                <Link href="/signin">
                  <span className="text-lg text-pink-700 hover:text-purple-700 cursor-pointer">Sign In</span>
                </Link>
                <Link href="/signup">
                  <span className="text-lg text-pink-700 hover:text-purple-700 cursor-pointer">Create an Account</span>
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex flex-col items-center justify-center flex-grow py-20 bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 text-gray-900">
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

          <footer className="w-full bg-purple-800 text-white py-8">
            <div className="max-w-5xl mx-auto flex flex-wrap justify-between text-sm">
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold mb-2">Training and assistance</h3>
                <ul>
                  <li><a href="#" className="hover:underline">News</a></li>
                  <li><a href="#" className="hover:underline">Wiki</a></li>
                  <li><a href="#" className="hover:underline">Forum</a></li>
                  <li><a href="#" className="hover:underline">Support</a></li>
                </ul>
              </div>
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold mb-2">Information</h3>
                <ul>
                  <li><a href="#" className="hover:underline">Recent Payments</a></li>
                  <li><a href="#" className="hover:underline">Publication Catalog</a></li>
                </ul>
              </div>
              <div className="mb-4 md:mb-0">
                <h3 className="font-semibold mb-2">Legal Information</h3>
                <ul>
                  <li><a href="#" className="hover:underline">Service rules</a></li>
                  <li><a href="#" className="hover:underline">Project Services</a></li>
                  <li><a href="#" className="hover:underline">Payment and Delivery Terms</a></li>
                  <li><a href="#" className="hover:underline">AML Policy</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">About Us</h3>
                <p>Contact</p>
                <p>&copy; SEOEARNING 2007-2014</p>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}
