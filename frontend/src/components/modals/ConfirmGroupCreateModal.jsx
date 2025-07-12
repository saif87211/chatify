import { Camera, Check, Undo2 } from "lucide-react";
import { truncateText } from "../../utils/helper";
import chatService from "../../api/chat";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUsersForGroup, setUsersAndGroups } from "../../slices/chatSlice";
import { modalIds } from "..";

export default function ConfirmGroupCreateModal() {
    const [groupName, setGroupName] = useState("");
    const authUser = useSelector(state => state.authSlice.authUserData);
    const selectedUsersForGroup = useSelector(state => state.chatSlice.selectedUsersForGroup);
    const dispatch = useDispatch();
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const handleGroupNameChange = (e) => setGroupName(e.target.value);

    const handlImageUpload = (e) => {
        const file = e.target.files[0]
        setImage(file);
        const imageUrl = URL.createObjectURL(file);
        setPreviewImage(imageUrl);
    };

    const handleCreateGroup = async () => {
        try {
            const membersIds = selectedUsersForGroup.map(user => user._id);

            const response = await chatService.createGroup(groupName, [authUser._id, ...membersIds], image);
            toast.success(response.message);
            setGroupName("");
            setImage(null);
            dispatch(setSelectedUsersForGroup([]));
        } catch (error) {
            toast.error(error.response?.data.message || "Something went wrong. Try agian later.");
        } 
    };

    const handleCancel = () => {
        document.getElementById(modalIds.CREATE_GROUP).checked = true;
        setGroupName("");
        setImage(null);
        setPreviewImage(null);
    }

    return (<>
        <input type="checkbox" id={modalIds.CONFIRM_GROUP_CREATE} className="modal-toggle" />
        <div className="modal" onClose={handleCancel}>
            <div className="modal-box" role="dialog">
                <h3 className="font-bold text-lg">New Group</h3>
                <p className="py-4">Select photo for group and provide your group name.</p>

                <div className="flex w-full my-1">

                    <div className="flex items-center gap-4 w-full">
                        {/* SELECT GROUP PHOTO */}
                        <div className="relative min-w-fit">
                            <img className="size-20 rounded-full object-cover border-4" src={previewImage || "user.png"} alt="group profile photo" />
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                <Camera className="w-5 h-5 text-base-200" />
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handlImageUpload} />
                            </label>
                        </div>
                        {/* GROUP NAME */}
                        <input type="text" placeholder="Group Name" className="input input-bordered w-full" value={groupName} onChange={handleGroupNameChange} />
                    </div>
                </div>

                <p className="font-bold my-2">Total Members: {selectedUsersForGroup.length + 1} </p>
                <div className="flex flex-wrap gap-1">
                    {/* List The users */}
                    <div className="flex flex-col items-center justify-center m-2">
                        <img className="size-10 rounded-full" src={authUser?.profilephoto || "./user.png"} alt={authUser?.fullname} />
                        <p className="text-sm">You</p>
                    </div>
                    {selectedUsersForGroup && selectedUsersForGroup.map(user => (
                        <div key={user._id} className="flex flex-col items-center justify-center m-2">
                            <img className="size-10 rounded-full" src={user.profilephoto || "./user.png"} alt={user.fullname} />
                            <p className="text-sm">{truncateText(user.fullname, 6)}</p>
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        {/* if there is a button in form, it will close the modal */}
                        <label className="btn btn-outline" htmlFor={modalIds.CONFIRM_GROUP_CREATE} onClick={handleCancel}>Cancel<Undo2 /></label>

                        <label htmlFor={modalIds.CONFIRM_GROUP_CREATE} className={`btn btn-outline ${!groupName.trim() ? "btn-disabled cursor-not-allowed" : ""}`} onClick={handleCreateGroup}>Create Group<Check className="font-bold" /></label>
                    </form>
                </div>
            </div>
        </div>
    </>
    )
}