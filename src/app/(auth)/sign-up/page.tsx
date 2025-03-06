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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { Button } from "@src/components/ui/button";
import { Loader2, Loader2Icon } from "lucide-react";
import {
  getDeviceIdentifier,
  getStoredDeviceIdentifier,
} from "@src/app/utils/deviceIndentifier";
import { signIn, useSession } from "next-auth/react";

function Page() {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deviceIdentifier, setDeviceIdentifier] = useState("");
  const [referralCode, setReferralCode] = useState("");

  const debounced = useDebounceCallback(setUsername, 300);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phoneNumber: 91,
      gender: "",
      age: 0,
      referredBy: "",
    },
  });

  // Retrieve or create deviceIdentifier
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

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      setReferralCode(refCode);
      form.setValue("referredBy", refCode);
    }
  }, [form]);

  // Check if username is unique whenever "username" changes
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setisCheckingUsername(true);
        setUsernameMessage("");

        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage("Error checking username or username already exists");
        } finally {
          setisCheckingUsername(false);
        }
      }
    };

    checkUsernameUnique();
  }, [username]);

  // Form submission
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", {
        ...data,
        deviceIdentifier,
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.replace(`/verify/${data.username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#114f1d] flex items-center justify-center p-4">
      {/* Outer Card */}
      <div className="w-full max-w-md bg-[#1f1f1f] text-white rounded-lg shadow-2xl p-6">
        {/* Header */}
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <h1 className="text-2xl font-bold text-blue-400">Register</h1>
        </div>
        <p className="text-gray-300 mb-6">Signup now and get full access to our app.</p>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Row 1: username & email */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="bg-#bcbbbb text-black border-none "
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
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
                            usernameMessage.includes("exists")
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {usernameMessage}
                        </p>
                      )}
                    </div>
                    <FormDescription>
                      Public display name: <span className="font-bold">{username}</span>
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
                      <Input
                        placeholder="Email"
                        className="bg-#bcbbbb text-black border-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: phoneNumber & password */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="phoneNumber"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Phone Number"
                        className="bg-#bcbbbb text-black border-none "
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password"
                        className="bg-#bcbbbb text-black border-none "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: gender & age */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                name="gender"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="bg-#bcbbbb text-black border-none "
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
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Age"
                        className="bg-#bcbbbb text-black border-none "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Row 4: referredBy */}
            <FormField
              name="referredBy"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Referred By</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      placeholder="Referred By"
                      className="bg-#bcbbbb text-black border-none "
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
              className="w-full bg-blue-600 hover:bg-blue-500 hover:shadow-md hover:shadow-blue-600/50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer */}
        <p className="mt-4 text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/sign-in" className="text-blue-500 hover:underline">
            Signin
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Page;
