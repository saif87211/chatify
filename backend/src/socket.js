import { Server } from "socket.io";
import { config } from "./config/config.js";
import { User } from "./models/user.model.js";
import { ApiError } from "./utils/ApiError.js";
import jwt from "jsonwebtoken";

export const socketEvents = Object.freeze({
    GROUP_UPDATE: "group:update",
    GROUP_MESSAGE: "group:message",
    GROUP_DELETE: "group:delete",
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    JOIN_GROUP_CHAT: "group:join",
    LEAVE_GROUP_CHAT: "group:leave",
    NEW_MESSAGE: "message:new",
    GET_ONLINE_USERS: "getOnlineUsers",
});

const userSocketMap = {};

const intializeSocket = (server) => {
    const io = new Server(server, {
        pingTimeout: 60000,
        cors: {
            origin: [config.origin],
            credentials: true
        }
    });

    io.on(socketEvents.CONNECTION, async (socket) => {
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

        io.emit(socketEvents.GET_ONLINE_USERS, Object.keys(userSocketMap));

        console.log("userSocketMap:", userSocketMap);

        socket.on(socketEvents.JOIN_GROUP_CHAT, (groupId) => {
            socket.join(groupId);
            console.log(`Socket ${socket.id} joined group room: ${groupId}`);
            console.log(socket.rooms);
        });
        socket.on(socketEvents.LEAVE_GROUP_CHAT, (groupId) => {
            socket.leave(groupId);
            console.log(`Socket ${socket.id} left group room: ${groupId}`);
        });
        socket.on(socketEvents.DISCONNECT, () => {
            delete userSocketMap[user._id];
            console.log("A user disconnected ", socket.id);
            io.emit(socketEvents.GET_ONLINE_USERS, Object.keys(userSocketMap));
        });
    });

    return io;
}

export default intializeSocket;

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

export function emitSocketEvent(io, event, data) {
    if (event === socketEvents.GROUP_UPDATE) {
        if (data && Array.isArray(data.members)) {
            data.members.forEach(memberId => {
                const socketId = getReceiverSocketId(memberId._id.toString());
                if (socketId) {
                    io.to(socketId).emit(event, data);
                }
            });
        }
    } else {
        for (const key in userSocketMap) {
            io.to(userSocketMap[key]).emit(event, data);
        }
    }
};