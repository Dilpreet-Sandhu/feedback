import {UserModel} from '@/models/user.model';
import dbConnect from '@/lib/dbConnect';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/helpers/sendEmail';


export async function POST(request : Request) {
    await dbConnect();
    try {
        
        const {username,email,password} = await request.json();

        const existingVerifiedUser = await UserModel.findOne({username,isVerified : true});

        if (existingVerifiedUser) {
            return Response.json({
                success :false,
                message :"username already take"
            },{
                status: 400
            })
        }

        const existingUserByEmail = await UserModel.findOne({email});
        const verfiyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success :false,
                    message :"user already exists with this email"
                },{status :400});
            }
            else {
                const hashedPassword = await bcrypt.hash(password,10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verfiyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
                await existingUserByEmail.save();
            }
        }else{
            const hashedPassword = await bcrypt.hash(password,10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = await UserModel.create({
                username,
                email,
                password : hashedPassword,
                verifyCode : verfiyCode,
                isVerified : false,
                verifyCodeExpiry : expiryDate,
                isAcceptingMessage : true,
                messages :[]
            })
        }

        const verificaitonEmail = await sendVerificationEmail(email,username,verfiyCode);

        if (!verificaitonEmail.success) {
            return Response.json({
                success :false,
                message : verificaitonEmail.message
            },{status:500})
        }
        else {
            return Response.json({
                success :true,
                message:"user registred successfully please verify your email"
            },{
                status :201
            })
        }


    } catch (error) {
        console.log("error while registering user",error);
        return Response.json({
            success : false,
            message : "error while registering user"
        },{
            status : 500
        })
    }   
}