"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z  from "zod"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, {AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Loader2Icon } from "lucide-react";
function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setisCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced =  useDebounceCallback(setUsername, 300);
  const {toast} = useToast()
  const router = useRouter()


// zod implimentation 

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      phoneNumber: 91 as number,
      gender: '',
      age: 0 as number,
      referredBy: '',

    }
  })


  useEffect(()=> {
    const checkUsernameUnique = async ()=> {
      if(username) {
        setisCheckingUsername(true)
        setUsernameMessage("")

        try {
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          let message = response.data.message;
          console.log(message);
          setUsernameMessage(message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
          
        } finally {
          setisCheckingUsername(false);
        }
      }
    }

    checkUsernameUnique()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)

    try {
      const response =  await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: "Success",
        description:  response.data.message
      })
      router.replace(`/verify/${username}`)
    } catch (error) {
      console.error("Error in signup in user", error)
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false);      
    }
  }
  return ( 
    <div className="flex items-center justify-center min-h-screen py-2 bg-gray-100">
      <div  className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
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
                <Input placeholder="Username" 
                {...field} 
                onChange={(e) => {
                  field.onChange(e)
                  debounced(e.target.value)
                }}
                />
              </FormControl>
                {isCheckingUsername && <Loader2Icon className="animate-spin" />}
                <p className={`text-sm ${usernameMessage === Response.message? 'text-green-500' : 'text-red-500'}`}> {username} {" "}{usernameMessage}</p>
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
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" 
                {...field}
                />
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
              <FormLabel>phone Number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="phone Number" 
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" 
                {...field}
                />
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
              <FormLabel>gender</FormLabel>
              <FormControl>
                <Input type="text" 
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
              <FormLabel>age</FormLabel>
              <FormControl>
                <Input type="number" placeholder="age" 
                {...field}
                />
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
              <FormLabel>referredBy</FormLabel>
              <FormControl>
                <Input placeholder="referredBy" 
                {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={isSubmitting}>{
          isSubmitting ? (<>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
          </>) :  ("sign Up")
        }</Button>

          </form>
        </Form>

        <p>
          Already a member?{' '}
          <Link href={"/sign-in"} className="text-blue-600">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Page;






























// import { useSession, signIn, signOut } from "next-auth/react"

// export default function Component() {
//   const { data: session } = useSession()
//   if (session) {
//     return (
//       <>
//         Signed in as {session.user.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     )
//   }
//   return (
//     <>
//       Not signed in <br />
//       <button  className="bg-orange-500 px-3 py-1 mx-4 rounded" onClick={() => signIn()}>Sign in</button>
//     </>
//   )
// }





// "use client"
// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';

// const Signin = () => {
//   // const router = useRouter();
//   const { register, handleSubmit, formState: { errors } } = useForm();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const onSubmit = async (data:any) => {
//     setLoading(true);
//     try {
//       const response = await axios.post('/api/next-auth/auth/signin', data);
//       if (response.status === 200) {
//         // router.push('/dashboard');
//       } else {
//         setError('Invalid credentials. Please try again.');
//       }
//     } catch (error:any) {
//       setError(error.response?.data?.message || 'Something went wrong. Please try again later.');
//     }
//     setLoading(false);
//   };

//   return (
//     <div>
//       <h1>Sign in</h1>
//       <form onSubmit={handleSubmit(onSubmit)}>
//         <div>
//           <label>Email/Phone:</label>
//           <input className='bg-blue-300' type="text" {...register('identifier', { required: true })} />
//           {errors.identifier && <span>Email or phone number is required</span>}
//         </div>
//         <div>
//           <label>Password:</label>
//           <input className='bg-purple-300' type="password" {...register('password', { required: true })} />
//           {errors.password && <span>Password is required</span>}
//         </div>
//         {error && <div>{error}</div>}
//         <button type="submit" disabled={loading}>Sign in</button>
//       </form>
//     </div>
//   );
// };

// export default Signin;
