"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProviders, signIn, ClientSafeProvider } from 'next-auth/react';
import { Button } from '@src/components/ui/button';

const SignIn = () => {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const fetchedProviders = await getProviders();
      setProviders(fetchedProviders);
    };

    fetchProviders();
  }, []);

  useEffect(() => {
    if (window.location.search.includes('callbackUrl')) {
      router.push('/Profile'); // Redirect to profile page
    }
  }, [router]);

  if (!providers) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to SEO Earning Space</h1>
        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="mb-4">
            <Button
              onClick={() => signIn(provider.id, { callbackUrl: '/Profile' })}
            >
              Sign in with {provider.name}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignIn;
