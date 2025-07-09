import { createContext, useContext } from "react";
import socketio from "socket.io-client";
import config from "../config/config";

const socketEvents = Object.freeze({
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

const getSocket = () => {
    const token = localStorage.getItem("token");
    return socketio(config.server_url, {
        withCredentials: true,
        auth: { token },
    });
};

const SocketContext = createContext({
    socket: null
});

const useSocket = () => useContext(SocketContext);

export { getSocket, useSocket, SocketContext, socketEvents };