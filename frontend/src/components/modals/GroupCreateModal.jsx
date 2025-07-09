import { Search, CircleCheck, X, ArrowBigRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ConfirmGroupCreateModal } from "../";
import { truncateText } from "../../utils/helper";
import { setSelectedUsersForGroup } from "../../slices/chatSlice";

export default function GroupCreateModal() {
    const sideBarUsersAndGroups = useSelector(state => state.chatSlice.usersAndGroups);
    const sideBarUsers = sideBarUsersAndGroups.filter(userOrGroup => userOrGroup.email);
    const selectedUsersForGroup = useSelector(state => state.chatSlice.selectedUsersForGroup);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const dispatch = useDispatch();

    const isUserSelectedForGroup = (user) => selectedGroupUsers.find(selectedGroupUser => selectedGroupUser._id === user._id);

    const [filterUsers, setFilterdUsers] = useState([]);

    useEffect(() => {
        setFilterdUsers(sideBarUsers);
        if (selectedUsersForGroup.length)
            setSelectedGroupUsers(selectedUsersForGroup);
    }, []);

    const handleSearch = (e) => {
        setFilterdUsers(sideBarUsers.filter(user => user.fullname.toLowerCase().includes(e.target.value?.toLowerCase())));
    }

    const handleModalClose = () => {
        setSelectedGroupUsers([]);
    }

    const handleCreateGroup = () => {
        dispatch(setSelectedUsersForGroup(selectedGroupUsers));
        document.getElementById('confirmGroupCreate').showModal();
    }

    const handleSelectUser = (user) => {
        if (!isUserSelectedForGroup(user))
            setSelectedGroupUsers(prevUsers => [...prevUsers, user]);
        else //remove user from the list
            setSelectedGroupUsers(prevUsers => prevUsers.filter((prevUser) => prevUser._id !== user._id));
    }

    return (
        <>
            <dialog id="createGroupModel" className="modal" onClose={handleModalClose}>
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Create Group</h3>
                    <p className="my-2">Select Members</p>
                    {/* SELECTED GROUP */}
                    <div className="flex flex-wrap gap-1 my-2 overflow-y-auto">
                        <button className="btn btn-sm btn-disabled">
                            <img className="size-5 rounded-full" src={authUser?.profilephoto || "./user.png"} alt={authUser?.fullname} />
                            <p>You</p>
                            {/* <X className="size-2" /> */}
                        </button>
                        {selectedGroupUsers && selectedGroupUsers.map(selectedUser => (
                            <button key={selectedUser?._id} className="btn btn-sm" onClick={() => {
                                setSelectedGroupUsers(prevUsers => prevUsers.filter((user) => user._id !== selectedUser?._id));
                            }}>
                                <img className="size-5 rounded-full" src={selectedUser?.profilephoto || "./user.png"} alt={selectedUser?.fullname} />
                                <p>{truncateText(selectedUser?.fullname, 5)}</p>
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
                                    <button key={user._id} className="w-full p-2 flex items-center gap-2 hover:bg-base-200 transition-colors"
                                        onClick={() => handleSelectUser(user)}>
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
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleModalClose} >
                                <X className="size-4" strokeWidth={3} />
                            </button>
                            <button className={`btn btn-sm btn-outline ${selectedGroupUsers.length ? "" : "btn-disabled cursor-not-allowed"}`} onClick={handleCreateGroup} >
                                Create Group&nbsp;<ArrowBigRight className="text-inherit" />
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
            <ConfirmGroupCreateModal />
        </>
    )
}