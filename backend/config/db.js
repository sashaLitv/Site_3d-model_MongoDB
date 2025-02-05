import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectDB = async () => { 
    try{
        console.log("MONGO_URI:", process.env.MONGO_URI); 

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "TaskManager"
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
        console.log(`Connecting db: ${error.message}`);
        process.exit(1);
    }

};

export default connectDB; 