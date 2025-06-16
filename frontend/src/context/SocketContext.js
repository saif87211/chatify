import { createContext, useContext } from "react";
import socketio from "socket.io-client";
import config from "../config/config";

const getSocket = (userId) => {
    const token = localStorage.getItem("token");
    console.log(token);
    return socketio(config.server_url, {
        withCredentials: true,
        auth: { token },
    });
};

const SocketContext = createContext({
    socket: null
});

const useSocket = () => useContext(SocketContext);

export { getSocket, useSocket, SocketContext };