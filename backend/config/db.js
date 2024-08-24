import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Successfully connected to the database");
    } catch (e) {
        console.log("Error while connecting to the database", e);
    }
}

export default connectToDB;
