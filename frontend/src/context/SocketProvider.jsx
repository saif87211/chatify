import { useEffect, useState } from "react";
import { getSocket, SocketContext } from "./SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "../slices/authSlice";

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    //user is already verified by the time of this component is mounted
    const authUser = useSelector(state => state.authSlice.authUserData);

    useEffect(() => {
        const newSocket = getSocket(authUser._id)
        console.log("newSockt: ", newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            console.log("userIds: ", userIds);
            dispatch(setOnlineUsers(userIds));
        });
        setSocket(newSocket);
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}