import { Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUsers, setSlectedUser } from "../slices/chatSlice";
import toast from "react-hot-toast";
import { SideBarSkeletion } from "./index";
import chatService from "../api/chat";

export default function SideBar() {
    const users = useSelector(state => state.chatSlice.users);
    const selectedUser = useSelector(state => state.chatSlice.selectedUser);
    const [userLoading, setUserLoading] = useState(true);
    const dispatch = useDispatch();

    const onlineUsers = [];

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
        getUsers();
    }, []);

    return (userLoading ?
        (<SideBarSkeletion />)
        : (
            <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transation-all duration-200">
                <div className="border-b border-base-300 w-full p-5">
                    <div className="flex items-center gap-2">
                        <Users className="size-6"/>
                        <span className="font-medium hidden lg:block">Contacts</span>
                    </div>
                    {/* TODO:filter online only */}
                    <div className="mt-3 hidden lg:flex items-center gap-2">
                        <label className="cursor-pointer flex items-center gap-2">
                            <input type="checkbox" className="checkbox checkbox-sm" />
                            <span className="text-sm">Show online only</span>
                            {/* Online users */}
                            <span className="text-xs text-zinc-500">21</span>
                        </label>
                    </div>
                </div>

                <div className="overflow-y-auto w-full py-3">
                    {users.map((user) => (
                        <button key={user._id} onClick={() => dispatch(setSlectedUser(user))} className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                            <div className="relative mx-auto lg:mx-0">
                                {/* profile image */}
                                <img className="size-12 object-cover rounded-full" src={user.profilephoto || "./user.png"} alt={user.fullname} />
                                {onlineUsers.includes(user._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                                )}
                                {/* online users is included */}
                            </div>
                            {/* user info - only visible on larger screen */}
                            <div className="hidden lg:block text-left min-w-0">
                                <div className="font-medium truncate">{user.fullname}</div>
                                <div className="text-sm text-zinc-400">
                                    {onlineUsers.includes(user._id) ? "Online" : "offline"}
                                </div>
                            </div>
                        </button>
                    ))}

                </div>
            </aside>
        ));
}