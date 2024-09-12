import {resend} from '@/lib/resend';
import VerificationEmail from '../../emails/VerificationEmail';
import { ApiResponse } from '@/types/ApiResponse';


export async function sendVerificationEmail(
    email : string,
    username : string,
    verifyCode : string
) : Promise<ApiResponse> {


    try {
        
        await resend.emails.send({
            from : "onboarding@resend.dev",
            to : email,
            subject : "verification code",
            react : VerificationEmail({username,otp : verifyCode})
        })

        return {
            success : true,
            message : "verification email sent successfully"
        }

    } catch (error) {
        console.error("error while sending email",error);
        return {success:false,message:"couldn't send email"}
    }

}