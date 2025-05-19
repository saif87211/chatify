import { Camera, Check, Undo2 } from "lucide-react";
import { truncateText } from "../utils/helper";

export default function ConfirmGroupCreateModel({ selectedGroupUsers }) {

    const handleCreateGroup = () => {
        console.log("Handle Create Group: ", selectedGroupUsers);
    };

    return (
        <dialog id="confirmGroupCreate" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">New Group</h3>
                <p className="py-4">Select photo for group and provide your group name.</p>

                <div className="flex w-full my-1">

                    <div className="flex items-center gap-4 w-full">
                        {/* SELECT GROUP PHOTO */}
                        <div className="relative min-w-fit">
                            <img className="size-20 rounded-full object-cover border-4" src={"user.png"} />
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                <Camera className="w-5 h-5 text-base-200" />
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                            </label>
                        </div>
                        {/* GROUP NAME */}
                        <input type="text" placeholder="Group Name" className="input input-bordered w-full" />
                    </div>
                </div>

                <p className="font-bold my-2">Total Members: {selectedGroupUsers.length} </p>
                <div className="flex flex-wrap gap-1">
                    {/* List The users */}
                    {selectedGroupUsers && selectedGroupUsers.map(user => (
                        <div key={user._id} className="flex flex-col items-center justify-center m-2">
                            <img className="size-10 rounded-full" src={user.profilephoto || "./user.png"} alt={user.fullname} />
                            <p className="text-sm">{truncateText(user.fullname, 6)}</p>
                        </div>
                    ))}
                </div>
                <div className="modal-action">
                    <form method="dialog" className="flex gap-2">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-outline" onClick={() => document.getElementById('createGroupModel').showModal()}>Cancel<Undo2 /></button>
                        <button className="btn btn-outline" onClick={handleCreateGroup} >Create Group<Check className="font-bold" /></button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}