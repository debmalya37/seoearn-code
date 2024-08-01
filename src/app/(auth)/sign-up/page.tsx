"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@src/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@src/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@src/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";
import { Loader2, Loader2Icon } from "lucide-react";
import { getDeviceIdentifier, getStoredDeviceIdentifier } from "@src/app/utils/deviceIndentifier";
import { signIn, useSession } from "next-auth/react";
function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceIdentifier, setDeviceIdentifier] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: 91,
      gender: '',
      age: 0,
      referredBy: '',
    },
  });

  useEffect(() => {
    const fetchDeviceIdentifier = async () => {
      const storedDeviceIdentifier = getStoredDeviceIdentifier();
      if (storedDeviceIdentifier) {
        setDeviceIdentifier(storedDeviceIdentifier);
      } else {
        const newDeviceIdentifier = await getDeviceIdentifier();
        setDeviceIdentifier(newDeviceIdentifier);
      }
    };

    fetchDeviceIdentifier();
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      form.setValue('referredBy', refCode);
    }
  }, [form]);

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMessage('');

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`);
          let message = response.data.message;
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage( 'Error checking username or username already exists');
        } finally {
          setisCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', { ...data, deviceIdentifier });
      toast({
        title: 'Success',
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);

      // const ChangeColor = ()=> {
      //   if(response.data.)
      // }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: 'Signup failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-2 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-400">
      <div className="w-full max-w-md p-8 space-y-8 bg-gradient-to-r from-pink-100 via-blue-100 to-pink-200 rounded-lg shadow-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome to SEO EARNING SPACE
          </h1>
          <p className="mb-4">Sign up to start your Earning journey</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2Icon className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage ? 'text-red-500' : 'text-green-500'}`}>
                    {username} {usernameMessage}
                  </p>
                  <FormDescription>
                    This is your public display name: <span className="font-bold">{username}</span>
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Phone Number" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="gender"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="referredBy"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referred By</FormLabel>
                  <FormControl>
                    <Input readOnly placeholder="Referred By" {...field} />
                  
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        {/* <button onClick={() => signIn('google')}>Sign in with Google</button> */}
        <p>
          Already a member?{' '}
          <Link href="/sign-in" className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
