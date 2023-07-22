import mongoose from "mongoose";
import dotenv from 'dotenv';
import { MONGO_URI, PORT } from '../.env';


dotenv.config();

const connect = async (): Promise<void> => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log("DB connected");
    } catch (err) {
        console.log(err);
    }
};

export default connect;
