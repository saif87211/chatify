import { Users } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setUsersAndGroups, setSlectedUserOrGroup } from "../slices/chatSlice";
import toast from "react-hot-toast";
import { SideBarSkeletion, GroupCreateModal, modalIds } from "./index";
import chatService from "../api/chat";

export default function SideBar() {
    const usersAndGroups = useSelector(state => state.chatSlice.usersAndGroups);
    const selectedUser = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const [userLoading, setUserLoading] = useState(true);
    const dispatch = useDispatch();
    const authStatus = useSelector(state => state.authSlice.authStatus);
    const onlineUsers = useSelector(state => state.authSlice.onlineUsers);
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await chatService.getSideBarUsersAndGroups();
                const newUsersAndGroups = response.data;
                if (newUsersAndGroups) {
                    dispatch(setUsersAndGroups(newUsersAndGroups));
                    setUserLoading(false);
                }
            } catch (error) {
                toast.error(error.response?.data.message || "Something went wrong.");
            }
        }
        if (authStatus)
            getUsers();
    }, []);

    const filteredUsersAndGroups = showOnlineOnly ? usersAndGroups.filter(user => onlineUsers.includes(user._id)) : usersAndGroups;

    const handleCheckBox = (e) => { setShowOnlineOnly(e.target.checked) };

    return (userLoading ?
        (<SideBarSkeletion />)
        : (
            <aside className={`h-full sm:w-72 sm:flex sm:flex-col ${selectedUser ? "hidden" : "w-full flex flex-col"} border-r border-base-300 duration-200`}>
                <div className="border-b border-base-300 w-full px-5 py-3">
                    <div className="flex justify-between gap-2">
                        <div className="flex items-center gap-2">
                            <Users className="size-6" />
                            <span className={`font-medium block`}>Contacts</span>
                        </div>
                        <div className="dropdown dropdown-end">
                            <div tabIndex={0} role="button" className="btn btn-sm rounded bg-base-100 hover:bg-base-200">New +</div>
                            <ul tabIndex={0} className="dropdown-content border border-base-300 menu bg-base-100 z-1 w-36 p-2 m-0 shadow-sm">
                                <li><a>New chat</a></li>
                                <li><label htmlFor={modalIds.CREATE_GROUP}>Create Group</label></li>
                            </ul>
                        </div>
                    </div>
                    <GroupCreateModal />
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
                    {filteredUsersAndGroups.map((userOrGroup) => (
                        <button key={userOrGroup._id}
                            onClick={() => {
                                if (userOrGroup._id !== selectedUser?._id)
                                    dispatch(setSlectedUserOrGroup(userOrGroup));
                            }}
                            className={`w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors ${selectedUser?._id === userOrGroup._id ? "bg-base-300 ring-1 ring-base-300" : ""}`}>
                            <div className="relative lg:mx-0">
                                {/* profile image */}
                                <img className="size-12 object-cover rounded-full" src={userOrGroup.profilephoto || "./user.png"} alt={userOrGroup.fullname} />
                                {onlineUsers.includes(userOrGroup._id) && (
                                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900"></span>
                                )}
                                {/* online users is included */}
                            </div>
                            {/* user info*/}
                            <div className={`${selectedUser ? "hidden" : ""} sm:block text-left min-w-0`}>
                                <div className="font-medium truncate">{userOrGroup.fullname ? userOrGroup.fullname : userOrGroup.name}</div>
                                <div className="text-sm text-zinc-400">
                                    {userOrGroup.members ? "Group" : (onlineUsers.includes(userOrGroup._id) ? "Online" : "offline")}
                                </div>
                            </div>
                        </button>
                    ))}

                    {filteredUsersAndGroups.length === 0 && (
                        <div className="text-center text-zinc-500 py-4">No online users</div>
                    )}
                </div>
            </aside>
        ));
}