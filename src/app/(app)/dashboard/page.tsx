'use client'
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/models/user.model";
import { acceptMessageScheam } from "@/schema/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageScheam),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    try {
      setIsSwitchLoading(true);
      const res = await axios.get<ApiResponse>("/api/accept-message");
      setValue("acceptMessages", res.data.isAcceptingMessage);
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "error ",
        description:
          axiosError.response?.data?.message || "Failed to fetch messages",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessage = useCallback(
    async (refresh?: boolean) => {
      try {
        setIsSwitchLoading(true);
        setIsLoading(true);
        const res = await axios.get<ApiResponse>("/api/get-message");
        setMessages(res?.data?.messages || []);
        if (refresh) {
          toast({
            title: "showing latest messages",
            description: "refreshed messages",
          });
        }
      } catch (error) {
        console.log(error);
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "error ",
          description:
            axiosError.response?.data?.message || "Failed to fetch messages",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessage();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessage]);

  const handleSwitchChange = async () => {
    try {
      const res = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
    } catch (error) {
      console.log("error");
    }
  };

  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipBoard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "your text has been copied to clipboard",
    });
  };

  if (!session || !session.user) {
    return <div>please login </div>;
  }

  return (
    <div className="my-8 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold  mb-4">User dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordred w-full pr-2 mr-2"
          />
          <Button onClick={copyToClipBoard}>Copy</Button>
        </div>
      </div>

    <div className="mb-4">
        <Switch
           {...register("acceptMessages")} 
           checked={acceptMessages}
           onCheckedChange={handleSwitchChange}
           disabled={isSwitchLoading}
        />
        <span className="ml-2">
            Accept Messages : {acceptMessages ? "On" : "Off"}
        </span>
    </div>
    <Separator/>

    <Button className="mt-4" variant="outline" onClick={(e) => {
        e.preventDefault();
        fetchMessage(true);
    }}>
        {
            isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin"/>
            ) : (
                <RefreshCcw className="h-4 w-4"/>
            )
        }
    </Button>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {
            messages.length > 0 ? (
                messages.map((message,idx) => (
                    <MessageCard
                     key={idx}
                     message={message}
                     onMessageDelete={handleDeleteMessage}
                     />
                ))
            ) : (
                <p>no messages to display</p>
            )
        }
    </div>

    </div>
  );
};

export default Page;
