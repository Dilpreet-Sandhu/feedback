import mongoose,{Schema,Document, models, model} from 'mongoose';

export interface Message extends Document{
    content : string;
    createdAt : Date
}

const messageSchema : Schema<Message> = new Schema({
    content: {
        type : String,
        required : true
    },
    createdAt : {
        type : Date,
        required : true,
        default : Date.now()
    }
});

export interface User extends Document {
    username : string;
    email : string;
    password : string;
    verifyCode : string;
    isVerified : boolean;
    verifyCodeExpiry : Date;
    isAcceptingMessage : boolean;
    messages : Message[]

}

const userSchema : Schema<User> = new Schema({
    username : {
        type : String,
        required : [true,"usename is required"],
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : [true,"email is required"],
        unique : true,
        match : [/.+\@.+\..+/,"please usera valid email"]
    },
    password : {
        type : String,
        required : true,
    },
    verifyCode : {
        type : String,
        required  :true,
    },
    verifyCodeExpiry : {
        type : Date,
        required : true,
    },
    isAcceptingMessage : {
        type :Boolean,
        default : false,
    },
    isVerified : {
        type : Boolean,
        default : false,
    },
    messages : [messageSchema],
})

export const UserModel = (models.UserModel as mongoose.Model<User>) || model<User>("UserModel",userSchema);
export const MessageModel = (models.MessageModel as mongoose.Model<Message>) || model<Message>("MessageModel",messageSchema);