import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";
import mongoose from "mongoose";


export async function GET(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            message :"you are not logged in",
            success :false
        },{status:400})
    }

    const userId = new mongoose.Types.ObjectId(user?._id);

    try {

        const dbUser =  await UserModel.aggregate([
            {$match : {id :userId}},
            {$unwind : "$messages"},
            {$sort : {"messages.createdAt":-1}},
            {$group : {_id :"$_id",messages : {$push : "$messages"}}}
        ]);

        console.log(dbUser);

        return Response.json({
            success : true,
            messages : dbUser[0].messages,
        },{status:200})

    } catch (error) {
        console.error("error while fetching messages" , error);
        return Response.json({
            success : false,
            message: "error while fetching messages",
        },{status:500})
    }
}