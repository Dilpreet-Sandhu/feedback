import mongoose from 'mongoose';

type connectionObject = {
    isConnected?: number
}

const connection : connectionObject = {};

async function dbConnect() : Promise<void> {
    if (connection.isConnected) {
        console.log("databse is already conneted");
        return 
    }

    try {
        const db = await mongoose.connect(process.env.MONGO_URL || "");

        connection.isConnected = db.connections[0].readyState;

        console.log("databsae connected")

    } catch (error) {
        console.log("error while connecting to database", error);
        process.exit(1);
    }
}

export default dbConnect;