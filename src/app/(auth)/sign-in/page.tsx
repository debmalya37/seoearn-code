'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getProviders, ClientSafeProvider } from 'next-auth/react';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { useToast } from '@src/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Fetch available NextAuth providers (Google, GitHub, etc.)
  useEffect(() => {
    (async () => {
      const data = await getProviders();
      setProviders(data);
    })();
  }, []);

  // Handle credential sign-in
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      toast({
        title: 'Login failed',
        description: result.error,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    } else {
      router.replace('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        {/* Glow behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl"></div>

        {/* Card Content */}
        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Welcome Back!</h1>

          {/* Credential Form */}
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 dark:bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 dark:bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Signing In…
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6 text-gray-400">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-2">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* OAuth Buttons */}
          {providers &&
            Object.values(providers).map((provider) =>
              provider.id !== 'credentials' ? (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className="w-full mb-3 bg-[#4285F4] hover:bg-[#357ae8] text-white py-3 rounded-xl flex items-center justify-center transition-all"
                >
                  Continue with {provider.name}
                </Button>
              ) : null
            )}

          {/* Footer Links */}
          <p className="mt-6 text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-indigo-400 hover:underline">
              Sign Up
            </Link>
          </p>
          <p className="mt-2 text-center text-gray-400">
            <Link href="/forgot-password" className="hover:underline">
              Forgot password?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
