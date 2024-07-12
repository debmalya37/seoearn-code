"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@src/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@src/components/ui/form"
import { Input } from "@src/components/ui/input"
import { signInSchema } from "@src/schemas/signInSchema"
import { useToast } from "@src/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { Loader2 } from "lucide-react"

function SignIn() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()
    const params = useParams<{username: string}>()
    const {toast} = useToast()
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
        },
    );
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const result = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        })
        if(result?.error) {
            if(result.error == "CredentialsSignin") {
                toast({
                    title: "Login Failed",
                    description: "Incorrect username or password",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive"
                })
            }
            
        } 
        else {
            toast({
                title: "Login Successful!",
                description: "redirecting to the Profile",
                variant: "default"
            })
        }
        if(result?.url) {
            router.replace('/Profile');

        }
    }
  return (
   
      <div className="flex items-center justify-center min-h-screen py-2 bg-gradient-to-r from-indigo-200 via-purple-300 to-pink-400" >
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-2xl">
            <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">SignIn to Your Account</h1>
                <p className="mb-4">Enter your signup Email & Password to Sign in</p>
            </div>
            <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
        control={form.control}
        name="identifier"
        render={({ field }) => (
            <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <FormControl>
                    <Input placeholder="Email/Username" {...field} />
                </FormControl>
            
            <FormMessage />
            </FormItem>
        )}
        />
        <FormField
        control={form.control}
        name="password"
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
         {/* is submitting function is to be set for loading */}
        <Button className="shadow-2xl" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
      </form>
    </Form>
    </div>
    </div>
  )
}

export default SignIn
