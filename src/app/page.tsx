'use client';

import BenefitsSection from '@src/components/home/BenefitsSection';
import ContentSection from '@src/components/home/ContentSection';
import Header from '@src/components/home/Header'; // Fixed casing
import SpecialSection from '@src/components/home/SpecialSection';
import StatsSection from '@src/components/home/StatsSection';
import { Button } from '@src/components/ui/button';
import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen m-0 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-400">
      <Head>
        <title>Home Page</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {session ? (
        <>
        <main className="container mx-auto p-4 flex-grow bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-400">
          <div className="flex items-center justify-between bg-purple-300 p-2 border border-gray-300 rounded mt-0 relative" >Welcome, {session.user?.email}
          <Button className="w-20 md:w-auto bg-orange-500 " onClick={()=> signOut()} >SignOut</Button>
          </div>
            <ContentSection />
            <StatsSection />
            <BenefitsSection />
            <SpecialSection />
            </main>
        
        </>
      ) : (
        <>
          <main className="container mx-auto p-4 flex-grow">
          <Header />
            <ContentSection />
            <StatsSection />
            <BenefitsSection />
            <SpecialSection />
          </main>
        </>
      )}
    </div>
  );
}
