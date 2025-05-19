import { Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUsers, setSlectedUser } from "../slices/chatSlice";
import toast from "react-hot-toast";
import { SideBarSkeletion,GroupCreateModel } from "./index";
import chatService from "../api/chat";

export default function SideBar() {
    const users = useSelector(state => state.chatSlice.users);
    const selectedUser = useSelector(state => state.chatSlice.selectedUser);
    const [userLoading, setUserLoading] = useState(true);
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.authSlice.authStatus);
    const onlineUsers = useSelector(state => state.authSlice.onlineUsers);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await chatService.getSideBarUsers();
                const newUsers = response.data?.users;
                if (newUsers) {
                    dispatch(setUsers(newUsers));
                    setUserLoading(false);
                }
            } catch (error) {
                toast.error(error.response?.data.message || "Something went wrong.");
            }
        }
        if (authStatus)
            getUsers();
    }, []);

    const filteredUsers = showOnlineOnly ? users.filter(user => onlineUsers.includes(user._id)) : users;

    const handleCheckBox = (e) => { setShowOnlineOnly(e.target.checked) };

    return (userLoading ?
        (<SideBarSkeletion />)
        : (
            <aside className={`h-full sm:w-72 ${selectedUser ? "hidden" : "w-full"} border-r border-base-300 sm:flex flex-col transation-all duration-200`}>
                <div className="border-b border-base-300 w-full p-5">
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Users className="size-6" />
                            <span className={`font-medium block`}>Contacts</span>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn m-1 rounded bg-base-100 hover:bg-base-200">New +</div>
                            <ul tabIndex={0} className="dropdown-content border border-base-300 menu bg-base-100 z-1 w-36 p-2 m-0 shadow-sm">
                                <li><a>New chat</a></li>
                                <li><a onClick={() => document.getElementById('createGroupModel').showModal()}>Create Group</a></li>
                            </ul>
                        </div>
                    </div>
                    <GroupCreateModel />
                    {/* TODO:filter online only */}
                    <div className="mt-3 flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input type="checkbox" checked={showOnlineOnly} onChange={handleCheckBox} className="checkbox checkbox-sm" />
                            <span className="text-sm">Show online only</span>
                            {/* Online users */}
                            <span className="text-xs text-zinc-500">{onlineUsers?.length - 1} Online</span>
                        </label>
                    </div>
                </div>

                <div className="overflow-y-auto w-full py-3">
                    {filteredUsers.map((user) => (
                        <button key={user._id}
                            onClick={() => {
                                if (user._id !== selectedUser?._id)
                                    dispatch(setSlectedUser(user));
                            }}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                            <div className="relative lg:mx-0">
                                {/* profile image */}
                                <img className="size-12 object-cover rounded-full" src={user.profilephoto || "./user.png"} alt={user.fullname} />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                                )}
                                {/* online users is included */}
                            </div>
                            {/* user info*/}
                            <div className={`${selectedUser ? "hidden" : ""} sm:block text-left min-w-0`}>
                                <div className="font-medium truncate">{user.fullname}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "offline"}
                                </div>
                            </div>
                        </button>
                    ))}

                    {filteredUsers.length === 0 && (
                        <div className="text-center text-zinc-500 py-4">No online users</div>
                    )}
                </div>
            </aside>
        ));
}