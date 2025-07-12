import { Camera, Users, Pen, Check, Search, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { truncateText } from "../../utils/helper.js";
import chatService from "../../api/chat.js";
import { setGroupData } from "../../slices/chatSlice.js";
import { modalIds } from "../index.js";

export default function GroupProfileModal() {
    const authUser = useSelector(state => state.authSlice.authUserData);
    const selectedGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const groupData = useSelector(state => state.chatSlice.groupData);
    const [edit, setEdit] = useState(false);
    const [groupName, setGroupName] = useState("");
    const [filterMembers, setFilterMembers] = useState([]);
    // const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log(groupData);
        const getGroupInformation = async () => {
            try {
                const response = await chatService.getGroupInfo(selectedGroup._id);
                dispatch(setGroupData(response.data));
                //TODO:API CALL
            } catch (error) {
                console.log(error);
                setGroupName(groupData.name);
                toast.error(error.response?.data.message || "Something went wrong.");
            }
        };
        if (selectedGroup)
            getGroupInformation();
    }, [selectedGroup]);

    useEffect(() => {
        if (groupData) {
            setGroupName(groupData.name);
            setFilterMembers(groupData.members);
        }
    }, [groupData, groupData?.members]);

    const onModalCloseHandle = () => {
        if (edit) setEdit(false);
        if (groupData.members.length !== filterMembers.length)
            setFilterMembers(groupData.members);
    }

    const handleEdit = () => setEdit(!edit);

    const handleOnChangeGroupName = (e) => setGroupName(e.target.value);

    const handleSearch = (e) => {
        const searchTerm = e.target.value.trim().toLowerCase();
        setFilterMembers(
            groupData.members.filter(user =>
                user.fullname.toLowerCase().includes(searchTerm) ||
                user.email.toLowerCase().includes(searchTerm)
            ))
    };

    const handleGroupNameEdit = async () => {
        try {
            if (groupName === groupData.name) {
                return;
            }
            const response = await chatService.updateGroupName(selectedGroup._id, groupName);
            if (response.success) toast.success(response.message || "Group name updated successfully");
        } catch (error) {
            toast.error(error.response?.message || "Something went wrong.");
        } finally {
            setEdit(!edit);
        }
    }

    const handleCancleGroupNameEdit = () => { setEdit(false); setGroupName(groupData.name) };

    const handleGroupExit = async (groupId) => {
        try {
            const response = await chatService.exitGroup(groupId);
            if (response.success) toast.success(response.message || "Group exit successfully");
        } catch (error) {
            toast.error(error.response?.message || "Something went wrong.");
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await chatService.updateGroupProfilePicture(groupData._id, file);
            if (response.success) toast.success(response.message || "Profile photo updated successfully");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.message || "Something went wrong while uploading profile");
        }
    }

    const removeUser = async (userIdToRemove) => {
        try {
            const response = await chatService.removeUserFromGroup(groupData._id, userIdToRemove);
            if (response.success)
                toast.success(response.message || "User removed successfully");
        }
        catch (error) {
            console.log(error);
            toast.error(error.response?.message || "Something went wrong.");
        }
    };

    const isUserAdmin = groupData ? groupData.admin === authUser._id : false;

    return (
        <>
            <input type="checkbox" id={modalIds.GROUP_PROFILE} className="modal-toggle" />
            <div id="group-profile" className="modal" role="dialog">
                <div className="modal-box" >
                    {/* TODO add loader */}
                    <div className="rounded-xl p-1 space-y-2">
                        <div className="text-center">
                            <h1 className="text-xl font-semibold">Group Information</h1>
                        </div>

                        {/* Image Upload */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                                {/* SELECT GROUP PHOTO */}
                                <div className="relative min-w-fit">
                                    <img className="size-20 rounded-full object-cover border-4" src={groupData?.profilephoto || "./user.png"} alt="group profile photo" />
                                    <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                        <Camera className="w-5 h-5 text-base-200" />
                                        <input type="file" id="profile-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="text-sm text-zinc-400 flex items-center gap-2">
                                        <Users className="size-4" />Group Name
                                    </div>
                                    <div className="join">
                                        <input className="input grow join-item input-bordered text-black" placeholder="text" onChange={handleOnChangeGroupName} value={groupName} disabled={!edit} />
                                        {!edit &&
                                            <button className="btn text-sm text-slate-100 btn-info join-item" onClick={handleEdit}>
                                                <Pen className="size-4" />
                                            </button>}
                                        {edit && <button className="btn text-slate-100 text-xs btn-success join-item" onClick={handleGroupNameEdit}>
                                            <Check className="size-4" />
                                        </button>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="">
                            {/* Members Search */}
                            <div className="text-sm text-zinc-400 flex items-center gap-2 my-2">
                                <Users className="size-4" />Group Members
                            </div>
                            <label className="input input-bordered flex items-center gap-2">
                                <input type="text" className="grow" placeholder="Search" onChange={handleSearch} onBlur={(e) => e.target.value = ""} />
                                <Search className="size-6" />
                            </label>
                            {/* Group Members */}
                            <div className="mt-4 overflow-y-auto w-full h-72 border border-base-300 rounded-lg">

                                {filterMembers && filterMembers.map(user => (
                                    <div key={user._id} className="flex justify-between items-center hover:bg-base-200 rounded-lg px-2">
                                        <div className="w-full p-3 flex items-center gap-3 transition-colors">
                                            <div className="relative lg:mx-0">
                                                {/* profile image */}
                                                <img className="size-12 object-cover rounded-full" src={user.profilephoto || "./user.png"} alt={"user profile"} />
                                            </div>
                                            {/* user info*/}
                                            <div className={`block text-left min-w-0`}>
                                                <div className="text-sm sm:text-md font-medium truncate">{(user._id === authUser._id ? " You" : truncateText(user.fullname, 12))}<span className="text-primary">{user._id === groupData.admin ? " (Admin)" : ""}</span></div>
                                                <div className="text-xs sm:text-sm text-zinc-400">
                                                    {truncateText(user.email, 14)}
                                                </div>
                                            </div>
                                        </div>
                                        {isUserAdmin && (user._id !== authUser._id) && <button className="btn btn-error btn-sm text-base-100" onClick={() => removeUser(user._id)}>Remove</button>}
                                        {(user._id === authUser._id) && <button className="btn btn-error text-base-100 btn-sm" onClick={() => handleGroupExit(groupData._id)}>Exit Group</button>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            {/* <button className="btn">Close</button> */}
                            <label htmlFor={modalIds.GROUP_PROFILE} className="btn font-bold btn-circle text-lg btn-ghost absolute right-2 top-2" onClick={onModalCloseHandle}>✕</label>
                        </form>
                    </div>
                </div>

            </div>
        </>);
}