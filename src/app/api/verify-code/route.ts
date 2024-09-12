import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/models/user.model";



export async function POST(requset : Request) {
    await dbConnect();

    try {
        
        const {username,code} = await requset.json();

        const decodedUsername = decodeURIComponent(username);

        const user = await UserModel.findOne({username : decodedUsername});

        if (!user) {
            return Response.json({
                message : "no user found with this username",
                success : false,
            },{status:400})
        }

        const isCodeCorrect = user.verifyCode == code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if (isCodeCorrect && isCodeNotExpired) {
             user.isVerified = true;
            await user.save();

            return Response.json({
                message : "user is verified successfully",
                success : true
            },{status:200})
        }
        else if(!isCodeNotExpired) {
            return Response.json({
                message : "your code is expired please sign up again",
                success : false,
            },{status : 400})
        }else {
            return Response.json({
                message : "incorred verify code",
                success :false
            },{status:400})
        }



    } catch (error) {
        console.error("error while check code",error);
        return Response.json({
            success :false,
            message :"could verfiy your code"
        },{status:5000})
    }
}