import { config } from "./config/config.js";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";


const app = express();

app.use(cors({
    origin: config.origin,
    credentials: "true"
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

//routes
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);


//error handler
app.use((err, req, res, next) => {
    console.log(err);
    return res.status(err.statuscode).json({ ...err, message: err.message });
});

export { app };