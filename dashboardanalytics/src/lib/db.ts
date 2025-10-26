import mongoose from "mongoose";

const dbconnect = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI environment variable is not defined.");
        }
        const connection = await mongoose.connect(uri);
    } catch (error) {

    }
}