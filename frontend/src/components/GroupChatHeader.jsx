import { X, UserPlus, Settings2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setGroupData, resetSelectedUserOrGroup } from "../slices/chatSlice";
import { AddUserInGroupModal, GroupProfileModal, modalIds } from ".";

export default function GroupChatHeader() {
    const selectedGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const groupData = useSelector(state => state.chatSlice.groupData);
    const dispatch = useDispatch();

    return (
        <>
            <div className="p-2.5 border-b border-base-300">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Profile */}
                        <div className="avatar">
                            <div className="size-10 rounded-full relative">
                                <img src={groupData?.profilephoto || selectedGroup.profilephoto || "./user.png"} alt={groupData?.name || "group profile"} />
                            </div>
                        </div>
                        {/* user info */}
                        <div>
                            <h3 className="font-medium">{groupData?.name || selectedGroup.name}</h3>
                            <p className="text-sm text-base-content/70">Members: {groupData?.members.length || selectedGroup.members.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-5">
                        <label className="btn btn-sm btn-rounded text-sm" htmlFor={modalIds.ADD_USER_IN_GROUP}>
                            <UserPlus size="18" />
                            <span className="hidden sm:inline">Add User</span>
                        </label>
                        <label htmlFor={modalIds.GROUP_PROFILE} className="btn btn-sm btn-rounded text-sm">
                            <Settings2 size="18" />
                            <span className="hidden sm:inline">Group Info</span>
                        </label>
                        {/* Close button */}
                        <button onClick={() => { dispatch(resetSelectedUserOrGroup()); dispatch(setGroupData(null)); }}>
                            <X />
                        </button>
                    </div>
                </div>
            </div>
            <GroupProfileModal />
            <AddUserInGroupModal />
        </>
    );
}