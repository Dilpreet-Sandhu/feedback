import {NextAuthOptions} from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import { UserModel } from '@/models/user.model';

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id : "credentails",
            name : "Credentials",
            credentials : {
                email : {type :"text",label : "email"},
                password : {type : "password",label : "password"}
            },
            async authorize(credentails : any) : Promise<any> {
                await dbConnect();

                try {
                    const user = await UserModel.findOne({
                        $or : [
                            {username : credentails.identifier},
                            {email  : credentails.identifier}
                        ]
                    });

                    if (!user) {
                        throw new Error("no user found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("please verify your account first before login")
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentails.password,user.password);

                    if (isPasswordCorrect) {
                        return user;
                    }
                    else {
                        throw new Error("incorret password")
                        
                    }

                } catch (err : any) {
                    throw new Error(err);
                }
            }
        })
    ],
    callbacks :{
        async jwt({user,token}) {

            if (user) {
                token._id = user?._id.toString();
                token.isVerified = user?.isVerified;
                token.isAcceptingMessage = user?.isAcceptingMessage;
                token.username = user?.username;
            }

            return token
        },
        async session({token,session}) {

            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessage = token.isAcceptingMessage;
                session.user.username = token.username;
            }

            return session
        },

    },
    pages :{
        signIn  :"/sign-in"
    },
    session :{
        strategy : "jwt"
    },
    secret : process.env.NEXT_AUTH_SECRET, 
}