'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from '@src/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { signUpSchema } from '@src/schemas/signUpSchema';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@src/types/ApiResponse';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@src/components/ui/form';
import { Input } from '@src/components/ui/input';
import { Button } from '@src/components/ui/button';
import { Loader2, Loader2Icon } from 'lucide-react';
import {
  getDeviceIdentifier,
  getStoredDeviceIdentifier,
} from '@src/app/utils/deviceIndentifier';

function SignUpPage() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [referralCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('ref') || '';
    }
    return '';
  });

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  // Initialize React Hook Form with Zod schema
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: 91,
      gender: '',
      age: 0,
      referralCode: '',
    },
  });

  // 1. Generate/Retrieve Device Identifier
  useEffect(() => {
    const fetchDeviceIdentifier = async () => {
      const stored = getStoredDeviceIdentifier();
      if (stored) {
        setDeviceIdentifier(stored);
      } else {
        const newId = await getDeviceIdentifier();
        setDeviceIdentifier(newId);
      }
    };
    fetchDeviceIdentifier();
  }, []);

  // 2. If URL has ?ref=CODE, populate referredBy field
  useEffect(() => {
    if (referralCode) {
      form.setValue('referralCode', referralCode);
    }
  }, [referralCode, form]);

  // 3. Debounced username → uniqueness check
  useEffect(() => {
    if (!username) {
      setUsernameMessage('');
      return;
    }
    const checkUsername = async () => {
      setIsCheckingUsername(true);
      try {
        const { data } = await axios.get<ApiResponse>(
          `/api/check-username-unique?username=${username}`
        );
        setUsernameMessage(data.message);
      } catch {
        setUsernameMessage('Error checking username or username already exists');
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsername();
  }, [username]);

  // 4. Form submission: register, then redirect to Sign-In
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      await axios.post<ApiResponse>('/api/sign-up', {
        ...data,
        referralCode: data.referralCode, 
        deviceIdentifier,
      });

      toast({
        title: 'Success',
        description: 'Account created. Please sign in.',
      });
      router.replace('/sign-in');
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      toast({
        title: 'Signup failed',
        description: axiosErr.response?.data.message || 'An error occurred',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-gray-800 text-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-300">Create Account</h1>
          <p className="mt-1 text-gray-400">Join now and start enjoying our platform</p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Username & Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                          setUsername(e.target.value);
                        }}
                      />
                    </FormControl>
                    <div className="flex items-center space-x-2 mt-1">
                      {isCheckingUsername && (
                        <Loader2Icon className="animate-spin text-gray-400 h-4 w-4" />
                      )}
                      {usernameMessage && (
                        <p
                          className={`text-xs ${
                            usernameMessage.includes('exists') ? 'text-red-500' : 'text-green-500'
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </div>
                    <FormDescription className="text-gray-400">
                      Display name shown to others: <span className="font-semibold">{username}</span>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Email Address</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Email"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone Number & Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Phone Number"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Gender & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Gender</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Gender"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="age"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Age"
                        className="bg-gray-700 text-white border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Referred By (read-only) */}
            <FormField
              name="referralCode"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Referred By</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      placeholder="Referral Code"
                      className="bg-gray-700 text-gray-300 border-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  Creating Account…
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </Form>

        {/* Footer: Link to Sign In */}
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-indigo-400 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default SignUpPage;
