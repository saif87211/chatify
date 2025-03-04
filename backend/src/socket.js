import { Server } from "socket.io";
import { config } from "./config/config.js";

const userSocketMap = {};

const intializeSocket = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: [config.origin],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        console.log("A user connected ", socket.id);

        const userId = socket.handshake.query.userId;

        if (userId)
            userSocketMap[userId] = socket.id;

        io.emit("getOnlineUsers", Object.keys(userSocketMap));

        console.log("userSocketMap:", userSocketMap);
        socket.on("disconnect", () => {
            delete userSocketMap[userId];
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