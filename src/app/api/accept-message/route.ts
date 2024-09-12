import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";
import { User } from "next-auth";



export async function POST(request : Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            message :"you are not logged in",
            success :false
        },{status:400})
    }

    const userId = user?._id;

    const {acceptMessages}  = await request.json();


    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(userId,{
            isAcceptingMessage : acceptMessages
        },{new :true}).select("-password");

        if (!updatedUser) {
            return Response.json({
                message :"couldn't update the user",
                success : false,
            },{status : 401})
        }
        return Response.json({
            message : "user updated success",
            success :true,
            user : updatedUser
        },{status:200})

    } catch (error) {
        console.error("failed to update the user")
        return Response.json({
            message : "failed to update the user",
            success : false
        },{status:500})
    }



}

export async function GET(request :Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user : User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            message :"you are not logged in",
            success :false
        },{status:400})
    }

    const userId = user?._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if(!foundUser) {
            return Response.json({
                message :"no user found",
                sucess :false
            },{status:400})
        }
        return Response.json({
            success : true,
            isAcceptingMessage : foundUser.isAcceptingMessage,
        },{status:200})

    } catch (error) {
        console.error("failed to fetch user" + error);
        return Response.json({
            message :"failed to fetch user",
            success :false
        },{status:500})
    }

}