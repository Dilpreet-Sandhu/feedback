import dbConnect from "@/lib/dbConnect";
import { Message, UserModel } from "@/models/user.model";



export async function POST(request : Request) {
    await dbConnect();
    try {
        const {username,content} = await request.json();
        const user = await UserModel.findOne({username});
        if (!user) {
            return Response.json({
                message : "no user found",
                success : false
            },{status:404})
        }

        if (!user.isAcceptingMessage) {
            return Response.json({
                message : "user is not accepting messages",
                success : false
            },{status:403})
        }

        const newMessage = {
            content,
            createdAt : new Date()
        };

        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json({
            message : "message sent successfully",
            success :true
        },{status:200});



    } catch (error) {
        console.error('error while sending message : ',error);
        return Response.json({
            message : "erro while sending message",
            success : false,
        },{status:500})
    }
}