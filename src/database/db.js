import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function dbConnection(){
    try {
        // console.log(`${process.env.MONGO_URI}`)
       await mongoose.connect(`${process.env.MONGO_URI}`)
       console.log("mongoDB connected")
    } catch (error) {
        console.error("failed to connect database", error)
    }
}

export default dbConnection;