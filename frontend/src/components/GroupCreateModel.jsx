import { Search, CircleCheck, X, ArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ConfirmGroupCreateModel } from "./";
import { truncateText } from "../utils/helper";

export default function GroupCreateModel() {
    const sideBarUsersAndGroups = useSelector(state => state.chatSlice.usersAndGroups);
    const sideBarUsers = sideBarUsersAndGroups.filter(userOrGroup => userOrGroup.email);

    const authUser = useSelector(state => state.authSlice.authUserData);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);

    const isUserSelectedForGroup = (user) => selectedGroupUsers.find(selectedGroupUser => selectedGroupUser._id === user._id);

    const [filterUsers, setFilterdUsers] = useState([]);


    useEffect(() => {
        setFilterdUsers(sideBarUsers);
    }, [])
    const handleSearch = (e) => {
        setFilterdUsers(sideBarUsers.filter(user => user.fullname.toLowerCase().includes(e.target.value?.toLowerCase())));
    }

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
                            <button key={selectedUser?._id} className="btn btn-sm" onClick={() => {
                                setSelectedGroupUsers(prevUsers => prevUsers.filter((user) => user._id !== selectedUser?._id));
                            }}>
                                <img className="size-5 rounded-full" src={selectedUser?.profilephoto || "./user.png"} alt={selectedUser?.fullname} />
                                <p>{truncateText(selectedUser?.fullname, 8)}</p>
                                <X className="size-3" strokeWidth={4} />
                            </button>
                        ))}
                    </div>

                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Search" onChange={handleSearch} />
                        <Search />
                    </label>

                    <div className="flex flex-col overflow-y-auto w-full py-2">
                        <div className="overflow-y-auto w-full h-72 my-1 border border-base-300 rounded-lg">
                            {/* CONTACTS */}
                            {
                                filterUsers && filterUsers.map(user => (
                                    <button key={user._id} className="w-full p-3 flex items-center gap-3 hover:bg-base-200 transition-colors" onClick={() => {
                                        if (!isUserSelectedForGroup(user)) {
                                            setSelectedGroupUsers(prevUsers => [...prevUsers, user]);
                                        } else {
                                            setSelectedGroupUsers(prevUsers => prevUsers.filter((user) => user._id !== user._id));
                                        }
                                    }}>
                                        <div className="relative lg:mx-0 indicator">
                                            {
                                                isUserSelectedForGroup(user) ? (
                                                    <span className="indicator-item indicator-bottom">
                                                        <CircleCheck color="#28e41b" />
                                                    </span>) : ("")
                                            }
                                            <img className="size-9 rounded-full" src={user.profilephoto || "./user.png"} alt={user.fullname || "profile photo"} />
                                        </div>
                                        <div className="sm:block text-left min-w-0">
                                            <div className="font-medium truncate">{user.fullname}</div>
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
            <ConfirmGroupCreateModel selectedGroupUsers={selectedGroupUsers} setSelectedGroupUsers={setSelectedGroupUsers} />
        </>
    )
}