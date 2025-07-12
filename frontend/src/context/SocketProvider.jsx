import { useEffect, useRef, useState } from "react";
import { getSocket, SocketContext } from "./SocketContext";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "../slices/authSlice";
import { socketEvents } from "./SocketContext";
import { resetSelectedUserOrGroup, setGroupData, setUsersAndGroups } from "../slices/chatSlice";

export default function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null);
    const dispatch = useDispatch();
    //user is already verified by the time of this component is mounted
    const authUser = useSelector(state => state.authSlice.authUserData);
    const selectedUserOrGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const usersAndGroups = useSelector(state => state.chatSlice.usersAndGroups);

    const selectedGroupRef = useRef(selectedUserOrGroup);
    const usersAndGroupsRef = useRef(usersAndGroups);

    useEffect(() => {
        selectedGroupRef.current = selectedUserOrGroup;
    }, [selectedUserOrGroup]);

    useEffect(() => {
        usersAndGroupsRef.current = usersAndGroups;
    }, [usersAndGroups]);

    useEffect(() => {
        if (authUser) {
            const newSocket = getSocket()

            newSocket.on(socketEvents.GET_ONLINE_USERS, (userIds) => {
                dispatch(setOnlineUsers(userIds));
            });
            setSocket(newSocket);
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.GET_ONLINE_USERS);
                console.log("socket disconnected", socket);
                socket.disconnect();
                setSocket(null);
            }
        }
    }, [authUser]);

    useEffect(() => {
        if (socket) {
            socket.on(socketEvents.GROUP_UPDATE, (data) => {
                console.trace("GROUP_UPDATE: ", data);
                if (selectedGroupRef.current && selectedGroupRef.current._id === data._id) {
                    dispatch(setGroupData(data));
                }

                const latestUsersAndGroups = usersAndGroupsRef.current;
                if (data.members.find(member => member._id === authUser._id)) {
                    const members = data.members.map(member => member._id);
                    const updateGroup = { ...data, members };
                    const updateUsersAndGroups = latestUsersAndGroups.filter(userOrGroup => userOrGroup._id !== data._id);
                    dispatch(setUsersAndGroups([...updateUsersAndGroups, updateGroup]));
                }
            });

            socket.on(socketEvents.GROUP_DELETE, (data) => {
                const latestUsersAndGroups = usersAndGroupsRef.current;
                const updateUsersAndGroups = latestUsersAndGroups.filter(userOrGroup => userOrGroup._id !== data.groupId);
                console.trace(updateUsersAndGroups);
                dispatch(setUsersAndGroups(updateUsersAndGroups));
                dispatch(resetSelectedUserOrGroup());
            });
        }

        return () => {
            if (socket) {
                socket.off(socketEvents.GROUP_UPDATE);
                socket.off(socketEvents.GROUP_DELETE);
            }
        }
    }, [socket, dispatch, authUser]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}