"use client";


import { signIn } from "next-auth/react";
import { FaUserAlt, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProviders,ClientSafeProvider } from 'next-auth/react';
import { Button } from '@src/components/ui/button';
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Example sign-in handler (adjust to your auth logic)
  const handleSignIn = () => {
    // signIn("credentials", { email, password, callbackUrl: "/Profile" });
    console.log("Sign In clicked");
  };
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

  
  const handleGoogleSignIn = () => {
    // signIn("google", { callbackUrl: "/Profile" });
    console.log("Google Sign In clicked");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#181818] p-4">
      {/* Outer Card */}
      <div className="w-full max-w-md bg-[#114f1d] rounded-2xl p-8 text-center shadow-[0_0_20px_rgba(255,255,255,0.1)] relative">
        {/* Slight glow around the card */}
        <div className="absolute inset-0 rounded-2xl pointer-events-none shadow-[0_0_60px_rgba(255,255,255,0.05)]" />

        {/* User Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-[#3a3a3a] rounded-full">
          <FaUserAlt className="text-gray-300 text-2xl" />
        </div>

        <h1 className="text-white text-2xl font-bold mb-6">Welcome Back!</h1>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded-md bg-#bcbbbb text-black focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400 font-bold"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-5 p-3 rounded-md bg-#bcbbbb text-black focus:outline-none focus:ring-2 focus:ring-gray-500 placeholder:text-gray-400 font-bold"
        />

        {/* Sign In Button */}
        <button
          onClick={handleSignIn}
          className="w-full mb-3 py-3 bg-#bcbbbb text-black font-semibold hover:bg-[#5c5c5c]
                     hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] transition-all duration-200"
        >
          Sign In
        </button>

        {/* Sign In With Google */}
        
         {/* Separator */}
         <div className="separator">
          <div></div>
          <span className="text-white">OR</span>
          <div></div>
        </div>
        <div className="flex w-full justify-between">
        {/* OAuth Buttons */}
        {Object.values(providers).map((provider) => (
          
          <button
            key={provider.name}
            className="oauthButton"
            onClick={() => signIn(provider.id, { callbackUrl: '/Profile' })}
          >
            Sign in with {provider.name}
          </button>
        ))}
      
      </div>
        {/* Footer Links */}
        <div className="mt-5 text-sm text-gray-400">
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-blue-400 hover:underline">
              Sign up, it&apos;s free!
            </Link>
          </p>
          <p>
            <Link href="/forgot-password" className="text-blue-400 hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
      </div>
  
  );
}
