import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function DELETE(request : Request,{params} : {params : {messageId : string}}) {
    await dbConnect();

    const messageId = params.messageId;
    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            message :"you are not logged in",
            success :false
        },{status:400})
    }

    try {
        const updatedResult = await UserModel.updateOne(
            {_id : user?._id},
            {
                $pull : {messages : {_id : messageId}}
            }
        );

        if (updatedResult.modifiedCount == 0) {
            return Response.json({
                message :"message not found or already deleted",
                success :false
            },{status:400})
        }
        return Response.json({
            message :"message deleted successfully",
            success :true
        },{status:200})
    } catch (error) {
        console.log("error while deleting message " + error);
        return Response.json({
            message :"errorr while delete message",
            success :false
        },{status:400})
    }
 
    
    
}