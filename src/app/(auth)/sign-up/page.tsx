"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signUpScheam } from "@/schema/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
const Page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isChekingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const router = useRouter();
  const { toast } = useToast();

  //zod implementation
  const form = useForm<z.infer<typeof signUpScheam>>({
    resolver: zodResolver(signUpScheam),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            `/api/checkUsername?username=${username}`
          );
          setUsernameMessage(res.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "error checking username"
          );
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data : z.infer<typeof signUpScheam>) => {
    setIsSubmitting(true);
    try {
        const res = await axios.post<ApiResponse>("/api/sign-up",data);

        toast({title : "Success",description : res?.data?.message});

        router.replace(`/verify/${username}`);

        setIsSubmitting(false);

    } catch (error) {
      console.error("error signing up user ",error)
      const axiosError = error as AxiosError<ApiResponse>;
      const errroMessage = axiosError.response?.data.message;

      toast({title : "sign up failed",description : errroMessage,variant:"destructive"});

      setIsSubmitting(false);

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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} onChange={(e) => {
                  field.onChange(e);
                  debounced(e.target.value);
                }}/>
              </FormControl>
              {isChekingUsername && <Loader2 className="animate-spin"/>}
              <p className={`text-sm ${usernameMessage == "usename is available" ? "text-green-500" : "text-red-500"}`}>
                {usernameMessage}
              </p>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
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
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? (
          <>
          <Loader2 className="mr-2 w-4 h-4 animate-spin"/> sigining up
          </>
        ) : "Sign up  "}</Button>
        </form>
      </Form>
      <div className="text-center mt-4">
        <p>
          Already a member{""}
          <Link href="/sign-in" className="text-blue-800 hover:text-blue-600">
          Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
};

export default Page;
