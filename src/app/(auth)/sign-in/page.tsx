"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInSchema, signUpScheam } from "@/schema/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
const Page = () => {

  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signUpScheam),
    defaultValues : {
      identifier: "",
      password: "",
    }
    
  });



  const onSubmit = async (data : z.infer<typeof signInSchema>) => {
    const res = await signIn("credentials",{
      identifier : data.identifier,
      password : data.password,
      redirect : false
    });

    if (res?.error) {
      if (res.error == "CredentailsSignin") {
        toast({
          title  : "login failed",
          description :"Incorrect email or password"
        })
      }
    }


  }



  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <h1 className="text-4xl tracking-lighter lg:text-5xl font-extrabold mb-6">Join mystery message</h1>
        <p className="mb-4">sign up to start your anonymous adventures</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field}/>
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
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} >{isSubmitting ? (
          <>
          <Loader2 className="mr-2 w-4 h-4 animate-spin"/> sigining in
          </>
        ) : "Sign In "}</Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          New here ?{""}
          <Link href="/sign-up" className="text-blue-800 hover:text-blue-600">
          Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
};

export default Page;
