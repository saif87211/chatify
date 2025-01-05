import mongoose from "mongoose";
import { config } from "../config/config.js";

const dbConnect = async () => {
    try {
        const dbConnectInstance = await mongoose.connect(`${config.mongodbUrl}/${config.dbName}`);
        console.log(`\n DB connected succefully!!! \nDB Host: ${dbConnectInstance.connection.host}`);
    } catch (error) {
        console.error("DB Connection Error: ", error);
        process.exit(1);
    }
}
export default dbConnect;