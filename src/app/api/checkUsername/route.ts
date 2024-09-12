import dbConnect from '@/lib/dbConnect';
import { UserModel } from '@/models/user.model';
import { usernameValidation } from '@/schema/signupSchema';
import {z} from 'zod';

const usernameQuerySchema = z.object({
    username : usernameValidation
});



export async function GET(req : Request) {

    await dbConnect();

    try {
        
        const {searchParams} = new URL(req.url);
        const queryParams = {
            username : searchParams.get("username")
        }

        //validate with zod
        const result = usernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];

            return Response.json({
                success : false,
                message : usernameErrors.length > 0 ? usernameErrors.join(",") : "invalid username"
            },{status:400});

        };

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username,isVerified : true});

        if (existingVerifiedUser) {
            return Response.json({
                success : false,
                message :"username already taken"
            })
        }
        return Response.json({
            success :false,
            message :"usename is available"
        })


    } catch (error) {
        console.error("error while checking username",error);
        return Response.json({
            message : "error checking username",
            success  :false,
        },{status:500})
    }
}