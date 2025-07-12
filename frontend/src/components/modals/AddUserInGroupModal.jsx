import { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowBigRight, CircleCheck, Search, UserRoundPlus, X } from "lucide-react";
import toast from "react-hot-toast";
import chatService from "../../api/chat";
import { setSlectedUserOrGroup } from "../../slices/chatSlice";
import { modalIds } from "..";

export default function AddUserInGroupModal() {
    const selectedGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const groupData = useSelector(state => state.chatSlice.groupData);
    const [selectedGroupUsers, setSelectedGroupUsers] = useState([]);
    const [filterUsers, setFilterUsers] = useState([]);
    const [email, setEmail] = useState("");
    const dispatch = useDispatch();
    const modalRef = useRef(null);
    const sideBarUsersAndGroups = useSelector(state => state.chatSlice.usersAndGroups);

    const sideBarUsersOnlyNotInGroup = useMemo(() => sideBarUsersAndGroups.filter(userOrGroup => {
        //check data has email and not the members of the current group
        let isAlreadyMember;
        if (groupData?.members)
            isAlreadyMember = !groupData.members.find(member => member._id === userOrGroup._id);
        else
            isAlreadyMember = !selectedGroup.members.find(member => member === userOrGroup._id);
        return (userOrGroup.email && isAlreadyMember);

    }), [groupData?.members, sideBarUsersAndGroups]);

    useEffect(() => {
        setFilterUsers(sideBarUsersOnlyNotInGroup);
    }, [groupData]);

    const isUserSelectedForGroup = (user) => selectedGroupUsers.find(selectedGroupUser => selectedGroupUser._id === user._id);

    const handleSearch = (e) => {
        setFilterUsers(sideBarUsersOnlyNotInGroup.filter(user => user.fullname.toLowerCase().includes(e.target.value?.toLowerCase())));
    }

    const handleAddListOfMembers = async () => {
        try {
            const idsOfNewMembers = selectedGroupUsers.map(user => user._id);
            const response = await chatService.AddMembersInGroup(selectedGroup._id, idsOfNewMembers);
            if (response.success) toast.success("New users are added in the group");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        } finally {
            if (modalRef.current) {
                setSelectedGroupUsers([]);
            }
        }
    }

    const handleAddNewUser = async () => {
        if (!email) {
            toast.error("Please enter email");
            return;
        }
        try {
            const response = await chatService.addUserInGroup(selectedGroup._id, email);
            // dispatch(setSlectedUserOrGroup(response.data));
            if (response.success) toast.success("New user is added in the group");
            setEmail("");
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong");
        } finally {
            if (modalRef.current)
                modalRef.current.close();
        }
    };

    const handleInputChange = (e) => setEmail(e.target.value.trim());

    return (
        <>
            <input type="checkbox" id={modalIds.ADD_USER_IN_GROUP} className="modal-toggle" />
            <div className="modal" ref={modalRef}>
                <div className="modal-box" role="dialog">
                    <h3 className="text-lg">Add new contact in group</h3>

                    <div className="join flex mt-2">
                        <input className="input grow join-item input-bordered text-black" type="email" placeholder="Email" onChange={handleInputChange} value={email} />
                        <button className="btn text-sm text-slate-100 btn-info join-item" onClick={handleAddNewUser}>
                            <UserRoundPlus className="size-15" />Add
                        </button>
                    </div>

                    <p className="my-2">Select Members</p>

                    <label className="input input-bordered flex items-center gap-2">
                        <input type="text" className="grow" placeholder="Type contact name" onChange={handleSearch} />
                        <Search className="size-5" />
                    </label>

                    <div className="flex flex-col overflow-y-auto w-full py-2">
                        <div className="overflow-y-auto w-full h-72 my-1 border border-base-300 rounded-lg">
                            {/* CONTACTS */}
                            {
                                filterUsers && filterUsers.map(user => (
                                    <button key={user._id} className="w-full p-2 flex items-center gap-2 hover:bg-base-200 transition-colors" onClick={() => {
                                        if (!isUserSelectedForGroup(user)) {
                                            setSelectedGroupUsers(prevUsers => [...prevUsers, user]);
                                        } else {
                                            setSelectedGroupUsers(prevUsers => prevUsers.filter((prevUser) => prevUser._id !== user._id));
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
                            {
                                filterUsers.length === 0 ? (<div className="text-center text-zinc-500 py-4">No users</div>) : ("")
                            }
                        </div>
                    </div>
                    <div className="modal-action">
                        <form method="dialog">
                            <label htmlFor={modalIds.ADD_USER_IN_GROUP} className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => { setSelectedGroupUsers([]); }} >
                                <X className="size-4" strokeWidth={3} />
                            </label>
                            <label htmlFor={modalIds.ADD_USER_IN_GROUP} className={`btn btn-sm btn-outline ${selectedGroupUsers.length ? "" : "btn-disabled cursor-not-allowed"}`} onClick={handleAddListOfMembers} >
                                Add Users&nbsp;<ArrowBigRight className="text-inherit" />
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </>);
}