import { createContext, useContext } from "react";
import socketio from "socket.io-client";
import config from "../config/config";

const getSocket = (userId) => {
    return socketio(config.server_url, {
        withCredentials: true,
        query: {
            userId
        }
    });
};

const SocketContext = createContext({
    socket: null
});

const useSocket = () => useContext(SocketContext);

export { getSocket, useSocket, SocketContext };