"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@src/components/ui/button";

import png1 from "../../asset/1.png";
import png2 from "../../asset/2.png";
import png3 from "../../asset/3.png";
import png4 from "../../asset/4.png";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar (simple) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="text-2xl font-bold text-purple-700">SEO Earning Space</div>
        <div className="space-x-4 hidden md:block">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#benefits" className="text-gray-600 hover:text-gray-900">
            Benefits
          </Link>
          <Link href="#stats" className="text-gray-600 hover:text-gray-900">
            Stats
          </Link>
          {session ? (
            <Button
              onClick={() => signOut()}
              className="bg-orange-500 hover:bg-orange-400 ml-2"
            >
              Sign Out
            </Button>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-orange-500 hover:bg-orange-400 ml-2">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {session ? (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              Welcome, {session.user?.email}
            </h1>
            <p className="text-xl md:text-2xl font-light">
              YOUR BEST PLACE TO GET EASY MICRO TASKS AND EARN REAL MONEY FROM IT.
              <br />
              POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS.
            </p>
            <div className="mt-6">
              <Button
                onClick={() => signOut()}
                className="bg-orange-500 hover:bg-orange-400 px-6 py-3"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </header>
      ) : (
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container mx-auto flex flex-col-reverse md:flex-row items-center py-12 px-4">
            {/* Text Section */}
            <div className="w-full md:w-1/2 text-center md:text-left mt-6 md:mt-0">
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-4">
                Welcome to SEO Earning Space
              </h1>
              <p className="text-lg md:text-xl mb-6">
                YOUR BEST PLACE TO GET EASY MICRO TASKS AND EARN REAL MONEY FROM IT.
                <br />
                POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS.
              </p>
              <Link href="/sign-in">
                <Button className="bg-orange-500 hover:bg-orange-400 px-6 py-3">
                  Get Started
                </Button>
              </Link>
            </div>
            {/* Image Section */}
            <div className="w-full md:w-1/2 flex justify-center">
              <Image
                src={png1}
                alt="Welcome Image"
                className="rounded-lg shadow-lg w-auto h-72 object-cover"
              />
            </div>
          </div>
        </header>
      )}

      {/* Stats Section */}
      <section
        id="stats"
        className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Stats Card 1 */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <span className="block text-5xl font-bold text-blue-600">31,9991</span>
          <span className="block text-sm text-orange-500">Total participants</span>
        </div>
        {/* Stats Card 2 */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <span className="block text-5xl font-bold text-blue-600">482</span>
          <span className="block text-sm text-orange-500">Now Online</span>
        </div>
        {/* Stats Card 3 */}
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <span className="block text-5xl font-bold text-blue-600">10,053,575</span>
          <span className="block text-sm text-orange-500">Total Earned</span>
        </div>
      </section>

      {/* Feature/Benefits Section */}
      <section
        id="features"
        className="container mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <Image
            src={png2}
            alt="image"
            width={320}
            height={240}
            className="rounded mb-4 w-auto h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-3">As well as:</h3>
          <ul className="list-disc list-inside text-gray-700 text-left">
            <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
            <li>A typical you can influence to help users decide.</li>
            <li>A typical you can influence to help users decide whether they should visit.</li>
            <li>A typical you can influence to help users decide whether they should visit your site through.</li>
          </ul>
        </div>

        {/* Card 2 */}
        <div
          id="benefits"
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center"
        >
          <Image
            src={png3}
            alt="image"
            width={320}
            height={240}
            className="rounded mb-4 w-auto h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-3">Your Benefits:</h3>
          <ul className="list-disc list-inside text-gray-700 text-left">
            <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
            <li>A typical you can influence to help users decide.</li>
            <li>A typical you can influence to help users decide whether they should visit.</li>
            <li>A typical you can influence to help users decide whether they should visit your site through.</li>
          </ul>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <Image
            src={png4}
            alt="image"
            width={320}
            height={240}
            className="rounded mb-4 w-auto h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-3">Especially for you:</h3>
          <ul className="list-disc list-inside text-gray-700 text-left">
            <li>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
            <li>A typical you can influence to help users decide.</li>
            <li>A typical you can influence to help users decide whether they should visit.</li>
            <li>A typical you can influence to help users decide whether they should visit your site through.</li>
          </ul>
        </div>
      </section>

      {/* Additional Stats row for "54,641 Advertisers" */}
      <section className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow p-6 text-center max-w-md mx-auto">
          <span className="block text-5xl font-bold text-blue-600">54,641</span>
          <span className="block text-sm text-orange-500">Advertisers</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Icons */}
          <div className="mb-4 md:mb-0">
            <ul className="flex space-x-4 text-xl">
              <li>
                <Link href="https://facebook.com" passHref>
                  <span className="hover:text-gray-300 cursor-pointer" aria-label="Facebook">
                    <FaFacebookF />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" passHref>
                  <span className="hover:text-gray-300 cursor-pointer" aria-label="Twitter">
                    <FaTwitter />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" passHref>
                  <span className="hover:text-gray-300 cursor-pointer" aria-label="Instagram">
                    <FaInstagram />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://linkedin.com" passHref>
                  <span className="hover:text-gray-300 cursor-pointer" aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Text */}
          <div className="text-center md:text-left">
            <p className="text-sm">
              Proudly powered by <strong>Kyrptaroid</strong>
            </p>
            <p className="text-sm">&copy; SEO Earning Space, 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
