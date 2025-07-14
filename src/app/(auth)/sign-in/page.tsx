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
  const [providers, setProviders] =
    useState<Record<string, ClientSafeProvider> | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Forgot Password Modal States
  const [showForgot, setShowForgot] = useState(false);
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [otpEmail, setOtpEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getProviders().then(setProviders);
  }, []);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    setIsSubmitting(false);
    if (result?.error) {
      toast({
        title: 'Login failed',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      router.replace('/');
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Email not found');
      setStep('verify');
      toast({ title: 'OTP sent', description: 'Check your inbox.' });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Invalid OTP');
      setStep('reset');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: otpEmail, otp, newPassword }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Reset failed');
      toast({ title: 'Password updated', description: 'You may now sign in.' });
      setShowForgot(false);
      setStep('email');
      setOtp('');
      setNewPassword('');
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-20 blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-white mb-6 text-center">Welcome Back!</h1>
          <form onSubmit={handleCredentialsSignIn} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-gray-700 text-white rounded-xl px-4 py-3"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl flex items-center justify-center"
            >
              {isSubmitting ? <><Loader2 className="animate-spin mr-2 h-5 w-5" />Signing In…</> : 'Sign In'}
            </Button>
          </form>

          <div className="flex items-center my-6 text-gray-400">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-2">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {providers &&
            Object.values(providers).map((provider) =>
              provider.id !== 'credentials' ? (
                <Button
                  key={provider.name}
                  onClick={() => signIn(provider.id, { callbackUrl: '/dashboard' })}
                  className="w-full mb-3 bg-[#4285F4] hover:bg-[#357ae8] text-white py-3 rounded-xl flex items-center justify-center"
                >
                  Continue with {provider.name}
                </Button>
              ) : null
            )}

          <p className="mt-6 text-center text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-indigo-400 hover:underline">Sign Up</Link>
          </p>

          <p className="mt-2 text-center text-gray-400">
            <button
              onClick={() => setShowForgot(true)}
              className="hover:underline"
            >
              Forgot password?
            </button>
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg">
            <button
              className="absolute top-2 right-3 text-gray-600 text-xl"
              onClick={() => {
                setShowForgot(false);
                setStep('email');
                setErrorMessage('');
              }}
            >×</button>

            {step === 'email' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <h2 className="text-xl font-semibold">Reset password</h2>
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full p-2 border rounded"
                  value={otpEmail}
                  onChange={e => setOtpEmail(e.target.value)}
                  required
                />
                <button className="w-full py-2 bg-blue-600 text-white rounded">
                  Send OTP
                </button>
              </form>
            )}

            {step === 'verify' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <h2 className="text-xl font-semibold">Enter OTP</h2>
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                <input
                  type="text"
                  placeholder="6-digit code"
                  className="w-full p-2 border rounded"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  required
                />
                <button className="w-full py-2 bg-blue-600 text-white rounded">
                  Verify
                </button>
              </form>
            )}

            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <h2 className="text-xl font-semibold">New Password</h2>
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full p-2 border rounded"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                />
                <button className="w-full py-2 bg-green-600 text-white rounded">
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
