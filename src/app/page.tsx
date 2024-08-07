'use client';
// import BenefitsSection from '@src/components/home/BenefitsSection';
// import ContentSection from '@src/components/home/ContentSection';
// import Header from '@src/components/home/Header'; // Fixed casing
// import SpecialSection from '@src/components/home/SpecialSection';
// import StatsSection from '@src/components/home/StatsSection';
import { Button } from '@src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Head from 'next/head';
import Image from 'next/image';
import png1 from "../../asset/1.png";
import png2 from "../../asset/2.png";
import png3 from "../../asset/3.png";
import png4 from "../../asset/4.png";
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="">
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <>
        <main className="">
          <div className="flex items-center justify-between bg-purple-300 p-2 border border-gray-300 rounded mt-0 relative">
            Welcome, {session.user?.email} 
            {/* <Image src={session.user?.image} alt='user logo'/> */}

            <Button className="w-20 md:w-auto bg-orange-500" onClick={() => signOut()}>SignOut</Button>
          </div>
          <main className="flex-1 px-8 py-4">
            <section className="text-center mb-8">
              <p className="text-sm leading-relaxed">
                
              <p>YOUR BEST PLACE TO GET EASY MICRO TASKS AND EARN REAL MONEY FROM IT</p>
              <p>POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS</p>
              </p>
            </section>

            <section className="flex flex-wrap justify-around mb-8">
              <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center mb-8">
                <div className="w-80 h-auto">
                  <Image src={png2} alt="image" width={320} height={240} />
                </div>
                <div className="mt-4 px-8">
                  <h3 className="text-lg font-semibold">As well as:</h3>
                  <ul className="list-disc list-inside mt-2 text-left">
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through.</li>
                  </ul>
                  <div className="flex justify-around mt-4">
                    <div className="text-center">
                      <span className="block text-5xl font-bold">31,9991</span>
                      <span className="block text-sm text-orange-500">Total participants</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-5xl font-bold">482</span>
                      <span className="block text-sm text-orange-500">Now Online</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center mb-8">
                <div className="w-80 h-auto">
                  <Image src={png3} alt="image" width={320} height={240} />
                </div>
                <div className="mt-4 px-8">
                  <h3 className="text-lg font-semibold">Your Benefits:</h3>
                  <ul className="list-disc list-inside mt-2 text-left">
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through.</li>
                  </ul>
                  <div className="text-center mt-4">
                    <span className="block text-5xl font-bold">10,053,575</span>
                    <span className="block text-sm text-orange-500">Total Earned</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 lg:w-1/3 flex flex-col items-center mb-8">
                <div className="w-80 h-auto">
                  <Image src={png4} alt="image" width={320} height={240} />
                </div>
                <div className="mt-4 px-8">
                  <h3 className="text-lg font-semibold">Especially for you:</h3>
                  <ul className="list-disc list-inside mt-2 text-left">
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through those search results.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit.</li>
                    <li className="flex items-start mb-2"><span className="w-4 h-4 bg-gradient-to-br from-pink-500 to-white rounded-full mr-2"></span>A typical you can influence to help users decide whether they should visit your site through.</li>
                  </ul>
                  <div className="text-center mt-4">
                    <span className="block text-5xl font-bold">54,641</span>
                    <span className="block text-sm text-orange-500">Advertisers</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        {/* start footer */}
        <footer className="bg-purple-700 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Icons */}
          <div className="mb-4 md:mb-0">
            <ul className="flex space-x-4">
              <li>
                <Link href="https://facebook.com" passHref>
                  <span className="hover:text-gray-300" aria-label="Facebook">
                    <FaFacebookF />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" passHref>
                  <span className="hover:text-gray-300" aria-label="Twitter">
                    <FaTwitter />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" passHref>
                  <span className="hover:text-gray-300" aria-label="Instagram">
                    <FaInstagram />
                  </span>
                </Link>
              </li>
              <li>
                <Link href="https://linkedin.com" passHref>
                  <span className="hover:text-gray-300" aria-label="LinkedIn">
                    <FaLinkedinIn />
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Footer Text */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm">Proudly powered by <strong>Kyrptaroid</strong></p>
            <p className="text-sm">&copy; SEO Earning Space, 2024. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>

            {/*  end footer  */}
        </main>
        </>
      ) : (
        <>
          <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-white to-white overflow-hidden">
            <header className="bg-white border-b border-gray-300">
              <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-orange-500">SEO Earning Space</h1>
                {/* <Button className="w-20 md:w-auto bg-orange-500" onClick={() => signOut()}>SignOut</Button> */}
              </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
              <Image src={png1} alt="Welcome Image" className="w-full h-auto max-w-sm mb-8" />
              <h2 className="text-4xl font-bold mb-4">Welcome to SEO Earning Space</h2>
              <p className="text-lg leading-relaxed mb-8">
              
                
                <p>YOUR BEST PLACE TO GET EASY MICRO TASKS AND EARN REAL MONEY FROM IT</p>
                <p>POST YOUR MICRO TASK ADVERTISEMENTS AND GET IT DONE BY MANY FREELANCERS</p>
              </p>
              
              <Link href="/sign-in">
              <Button className="w-40 md:w-auto bg-orange-500">Get Started</Button>
              </Link>
            </main>

            <footer className="bg-purple-700 text-white py-4 relative overflow-hidden">
              <div className="container mx-auto text-center">
                <p>&copy; 2024 SEO Earning Space. All rights reserved.</p>
                <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                  <span className="text-sm text-gray-300 animate-pulse">
                    Done by Kryptaroid
                  </span>
                </div>
              </div>
            </footer>
          </div>
        </>
      )}
    </div>
  );
}
