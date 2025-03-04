import { useEffect, useState } from "react";
import socketio from 'socket.io-client';
import config from "../config/config";

export default function useSocket(userId) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (userId) {
            const newSocket = socketio(config.server_url, {
                withCredentials: true,
                query: { userId },
            });

            setSocket(newSocket);

            return () => {
                if (socket) {
                    newSocket.disconnect();
                }
            };
        }

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, [userId]);

    return socket;
}