import { Search, CircleCheck, X, ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { ConfirmGroupCreateModel } from "./";
import { truncateText } from "../utils/helper";

export default function GroupCreateModel() {
    const sideBarUsers = useSelector(state => state.chatSlice.users);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

    const isUserSelectedForGroup = (user) => selectedGroupUsers.find(selectedGroupUser => selectedGroupUser._id === user._id);

    return (
        <>
            <dialog id="createGroupModel" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Group</h3>
                    <p className="my-2">Select Members</p>
                    {/* SELECTED GROUP */}
                    <div className="flex flex-wrap gap-1 my-2 overflow-y-auto">
                        <button className="btn btn-sm btn-disabled">
                            <img className="size-5 rounded-full" src={authUser.profilephoto || "./user.png"} alt={authUser.fullname} />
                            <p>You</p>
                            {/* <X className="size-2" /> */}
                        </button>
                        {selectedGroupUsers && selectedGroupUsers.map(selectedUser => (
                            <button key={selectedUser._id} className="btn btn-sm" onClick={() => {
                                setSelectedGroupUsers(prevUsers => prevUsers.filter((user) => user._id !== selectedUser._id));
                            }}>
                                <img className="size-5 rounded-full" src={selectedUser.profilephoto || "./user.png"} alt={selectedUser.fullname} />
                                <p>{truncateText(selectedUser.fullname, 8)}</p>
                                <X className="size-3" strokeWidth={4} />
                            </button>
                        ))}
                    </div>

                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" />
                        <Search />
                    </label>

                    <div className="flex flex-col overflow-y-auto w-full py-2">
                        <div className="overflow-y-auto w-full h-72 my-1 border border-base-300 rounded-lg">
                            {/* CONTACTS */}
                            {
                                sideBarUsers && sideBarUsers.map(sideBarUser => (
                                    <button key={sideBarUser._id} className="w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors" onClick={() => {
                                        if (!isUserSelectedForGroup(sideBarUser)) {
                                            setSelectedGroupUsers(prevUsers => [...prevUsers, sideBarUser]);
                                        } else {
                                            setSelectedGroupUsers(prevUsers => prevUsers.filter((user) => user._id !== sideBarUser._id));
                                        }
                                    }}>
                                        <div className="relative lg:mx-0 indicator">
                                            {
                                                isUserSelectedForGroup(sideBarUser) ? (
                                                    <span className="indicator-item indicator-bottom">
                                                        <CircleCheck color="#28e41b" />
                                                    </span>) : ("")
                                            }
                                            <img className="size-9 rounded-full" src={sideBarUser.profilephoto || "./user.png"} alt={sideBarUser.fullname || "profile photo"} />
                                        </div>
                                        <div className="sm:block text-left min-w-0">
                                            <div className="font-medium truncate">{sideBarUser.fullname}</div>
                                        </div>
                                    </button>
                                ))
                            }

                        </div>
                    </div>
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => { setSelectedGroupUsers([]); }} >
                            <X className="size-4" strokeWidth={3} />
                        </button>
                    </form>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className={`btn btn-outline ${selectedGroupUsers.length ? "" : "btn-disabled cursor-not-allowed"}`} onClick={() => document.getElementById('confirmGroupCreate').showModal()} >
                                Create Group&nbsp;<ArrowBigRight className="text-inherit" />
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
            <ConfirmGroupCreateModel selectedGroupUsers={selectedGroupUsers} />
        </>
    )
}