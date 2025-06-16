import { Server } from "socket.io";
import { config } from "./config/config.js";
import { User } from "./models/user.model.js";
import { ApiError } from "./utils/ApiError.js";
import jwt from "jsonwebtoken";

const userSocketMap = {};

const intializeSocket = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: [config.origin],
            credentials: true
        }
    });

    io.on("connection", async (socket) => {
        console.log("A user connected ", socket.id);

        const token = socket.handshake.auth?.token;

        if (!token) {
            // Token is required for the socket to work
            throw new ApiError(401, "Un-authorized handshake. Token is missing");
        }

        const decodedToken = jwt.verify(token, config.tokenSecret);

        const user = await User.findById(decodedToken?._id).select("-password");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token.");
        }

        userSocketMap[user._id] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        console.log("userSocketMap:", userSocketMap);

        socket.on("joinGroup", (groupId) => {
            socket.join(groupId);
            console.log(`Socket ${socket.id} joined group room: ${groupId}`);
            console.log(socket.rooms);
        });
        socket.on('leaveGroupChat', (groupId) => {
            socket.leave(groupId);
            console.log(`Socket ${socket.id} left group room: ${groupId}`);
        });
        socket.on("disconnect", () => {
            delete userSocketMap[user._id];
            console.log("A user disconnected ", socket.id);
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
        });
    });

    return io;
}

export default intializeSocket;

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}