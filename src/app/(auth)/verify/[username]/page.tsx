'use client'
import { useToast } from "@/hooks/use-toast";
import { verifySchema } from "@/schema/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const res = await axios.post("/api/verify-code", {
        username,
        code: data.code,
      });

      toast({
        title: "successfull",
        description: res.data.message,
      });
    } catch (error) {
      console.error("error verifying code  ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const errroMessage = axiosError.response?.data.message;

      toast({
        title: "sign up failed",
        description: errroMessage,
        variant: "destructive",
      });
    }
  };

  return (
  <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
    <div className="text-center">
        <h1 className="text-4xl tracking-lighter lg:text-5xl font-extrabold mb-6">Verify your account</h1>
        <p className="mb-4">Enter verification code sent to your email</p>
      </div>
    </div>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>code</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  </div>
  )
}
