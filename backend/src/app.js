import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import { config } from "./config/config.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import intializeSocket from "./socket.js";

const app = express();

const server = http.createServer(app);

const io = intializeSocket(server);

app.use(cors({
    origin: config.origin,
    credentials: true
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ limit: "20kb", extended: true }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

//routes
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import groupRoutes from "./routes/group.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/groups", groupRoutes);

//error handler
app.use(errorHandler);

export { app, server, io };