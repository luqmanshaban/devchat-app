import mongoose from "mongoose";
import 'dotenv/config'

const database = process.env.MONGODB_URI

export async function connectToDB() {
    try {
        await mongoose.connect(database, {
            autoIndex: true,
        })
        console.log('DATABASE CONNECTED');
    } catch (error) {
        console.error(error);
    }
}