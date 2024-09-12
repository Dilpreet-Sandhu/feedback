import React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/models/user.model";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "@/hooks/use-toast";
import { title } from "process";


type MessageCardProps = {
    message :Message;
    onMessageDelete : (messageId : string) => void
}

function MessageCard({message,onMessageDelete} :MessageCardProps) {

    const {toast} = useToast();


    const handleDelete = async () => {
        const res = await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
        toast({
            title  :res.data.message
        });
        onMessageDelete(message._id as string);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive"><X className="w-5 h-5"/></Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
        <CardDescription>Card description</CardDescription>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
