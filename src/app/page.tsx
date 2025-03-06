"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@src/components/ui/button";

import png2 from "../../asset/2.png";
import png3 from "../../asset/3.png";
import png4 from "../../asset/4.png";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-[#f6fef9] min-h-screen flex flex-col items-center px-4 py-8 md:flex-row md:justify-between md:px-16">
        {/* Left Text */}
        <div className="max-w-xl mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 leading-tight mb-4">
            YOUR BEST PLACE TO GET EASY MICRO TASKS AND EARN REAL MONEY FROM IT
          </h1>
          <p className="text-gray-600 text-lg md:text-xl mb-6">
            POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS
          </p>
          <div className="flex space-x-4">
            <Link href="/sign-in">
              <Button className="bg-green-600 hover:bg-green-500 text-white px-6 py-3">
                Get Started
              </Button>
            </Link>
            <Button variant="outline" className="border-green-600 text-green-700 px-6 py-3">
              View Demo
            </Button>
          </div>
        </div>

        {/* Right Chart/Card Placeholder */}
        <div className="w-full md:w-1/2 flex justify-center">
          {/* Replace this placeholder with your actual chart/image */}
          <div className="w-72 h-72 rounded-full bg-green-200 flex flex-col items-center justify-center shadow-lg">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Total Earned</h2>
            <span className="text-4xl font-bold text-green-700">$10,053,575</span>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-white py-8 md:py-12 px-4 md:px-16 flex flex-col md:flex-row justify-center items-center gap-8">
        {/* Stat 1 */}
        <div className="text-center">
          <h3 className="text-4xl font-bold text-green-700">31,9991</h3>
          <p className="text-gray-600">Total participants</p>
        </div>
        {/* Stat 2 */}
        <div className="text-center">
          <h3 className="text-4xl font-bold text-green-700">482</h3>
          <p className="text-gray-600">Now Online</p>
        </div>
        {/* Stat 3 */}
        <div className="text-center">
          <h3 className="text-4xl font-bold text-green-700">10,053,575</h3>
          <p className="text-gray-600">Total Earned</p>
        </div>
      </section>

      {/* Three Feature Cards */}
      <section className="bg-[#f6fef9] py-12 px-4 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: As well as */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="w-full h-48 mb-4 overflow-hidden rounded">
              <Image
                src={png2}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">As well as:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </div>

          {/* Card 2: Your Benefits */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="w-full h-48 mb-4 overflow-hidden rounded">
              <Image
                src={png3}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">Your Benefits:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </div>

          {/* Card 3: Especially for you */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="w-full h-48 mb-4 overflow-hidden rounded">
              <Image
                src={png4}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">Especially for you:</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                A typical you can influence to help users decide whether they should
                visit your site through those search results.
              </li>
              <li>A typical you can influence to help users decide.</li>
              <li>
                A typical you can influence to help users decide whether they
                should visit.
              </li>
              <li>
                A typical you can influence to help users decide whether they
                should visit your site through.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Single Stat */}
      <section className="bg-white py-8 px-4 md:px-16">
        <div className="max-w-md mx-auto bg-green-50 rounded-lg shadow p-6 text-center">
          <h3 className="text-4xl font-bold text-green-700">54,641</h3>
          <p className="text-gray-600">Advertisers</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 px-4 md:px-16 border-t border-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-4 md:mb-0 text-gray-600 text-2xl">
            <Link href="https://facebook.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Facebook">
                <FaFacebookF />
              </span>
            </Link>
            <Link href="https://twitter.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Twitter">
                <FaTwitter />
              </span>
            </Link>
            <Link href="https://instagram.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="Instagram">
                <FaInstagram />
              </span>
            </Link>
            <Link href="https://linkedin.com" passHref>
              <span className="hover:text-green-700 cursor-pointer" aria-label="LinkedIn">
                <FaLinkedinIn />
              </span>
            </Link>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-500">
              Proudly powered by <strong>Kyrptaroid</strong>
            </p>
            <p className="text-gray-500">&copy; SEO Earning Space, 2024. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
