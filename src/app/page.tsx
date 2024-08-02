'use client';

import BenefitsSection from '@src/components/home/BenefitsSection';
import ContentSection from '@src/components/home/ContentSection';
import Header from '@src/components/home/Header'; // Fixed casing
import SpecialSection from '@src/components/home/SpecialSection';
import StatsSection from '@src/components/home/StatsSection';
import { Button } from '@src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import png1 from "../../asset/1.png";
import png2 from "../../asset/2.png";
import png3 from "../../asset/3.png";
import png4 from "../../asset/4.png";
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
          <div className="flex items-center justify-between bg-purple-300 p-2 border border-gray-300 rounded mt-0 relative" >Welcome, {session.user?.email}
          <Button className="w-20 md:w-auto bg-orange-500 " onClick={()=> signOut()} >SignOut</Button>
          </div>
          <main className="flex-1 px-8 py-4">
        <section className="text-center mb-8">
          <p className="text-sm leading-relaxed">
            The <u>Search Essentials</u> outline the most important elements of what makes your website eligible to appear on Google Search. While there's no guarantee that any particular site will be added to Google's index, sites that follow the Search Essentials are more likely to show up in Google's search results. SEO is about taking the next step and working on improving your site's presence in Search. This guide will walk you through some of the most common and effective improvements you can do on your site.
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

      <footer className="bg-purple-700 text-white py-4">
      <div className="container mx-auto text-center">
             <p>&copy; 2024 SEO Earning Space. All rights reserved.</p>
           </div>
         </footer>
            </main>
        
        </>
      ) : (
        <>
              <div className="flex flex-col min-h-screen bg-gradient-to-br from-yellow-100 via-white to-white overflow-hidden">
      <header className="bg-white border-b border-gray-300">
        <div className="flex justify-between items-center px-8 py-4">
          <div className="flex items-center">
            <div className="w-16 h-16">
              <Image src={png1} alt="Logo" width={64} height={64} />
            </div>
            <h3 className="ml-4 font-bold text-lg">SEO EARNING SPACE</h3>
          </div>
          <div className="flex space-x-4">
            <button className="px-8 py-2 border border-gray-700 rounded hover:bg-gray-200">Login</button>
            <button className="px-8 py-2 bg-purple-700 text-white border border-purple-700 rounded hover:bg-purple-800">SignUp</button>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-4">
        <section className="text-center mb-8">
          <p className="text-sm leading-relaxed">
            The <u>Search Essentials</u> outline the most important elements of what makes your website eligible to appear on Google Search. While there's no guarantee that any particular site will be added to Google's index, sites that follow the Search Essentials are more likely to show up in Google's search results. SEO is about taking the next step and working on improving your site's presence in Search. This guide will walk you through some of the most common and effective improvements you can do on your site.
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

      <footer className="bg-purple-700 text-white py-4">
      <div className="container mx-auto text-center">
             <p>&copy; 2024 SEO Earning Space. All rights reserved.</p>
           </div>
         </footer>
       </div>
        </>
      )}
    </div>
  );
}




