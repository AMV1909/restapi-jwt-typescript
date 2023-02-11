import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = connect(process.env.MONGODB_URI)
    .then(() => console.log("Database is connected"))
    .catch((err) => console.log(err));
