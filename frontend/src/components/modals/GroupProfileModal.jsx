import auth from "../../api/auth";
import { Camera, Mail, Users, Pen, Check, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { truncateText } from "../../utils/helper.js";
import { GroupProfileModalSkeletion } from "../"

export default function GroupProfileModal() {
    const authUser = useSelector(state => state.authSlice.authUserData);
    const selectedGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const [edit, setEdit] = useState(false);
    const [groupName, setGroupName] = useState(selectedGroup.name);
    const [groupData, setGroupData] = useState();
    const [filterMembers, setFilterMembers] = useState([]);

    const dispatch = useDispatch();

    useEffect(() => {
        const getGroupInfo = async () => {
            try {
                const response = {
                    "statuscode": 200,
                    "data": {
                        "_id": "684c633712c3619ee8cd8748",
                        "name": "Todomar",
                        "admin": {
                            "_id": "67da3dda613a829b2299890e",
                            "username": "sam123",
                            "email": "sam@mail.com",
                            "fullname": "sam",
                            "createdAt": "2025-03-19T03:45:30.796Z",
                            "updatedAt": "2025-03-31T11:35:40.381Z",
                            "__v": 0,
                            "profilephoto": "http://res.cloudinary.com/youtubevideosbackend/image/upload/v1743420939/qqfdgvm9s2et04ewnw2z.jpg"
                        },
                        "members": [
                            {
                                "_id": "67da3dda613a829b2299890e",
                                "username": "sam123",
                                "email": "sam@mail.com",
                                "fullname": "sam",
                                "createdAt": "2025-03-19T03:45:30.796Z",
                                "updatedAt": "2025-03-31T11:35:40.381Z",
                                "__v": 0,
                                "profilephoto": "http://res.cloudinary.com/youtubevideosbackend/image/upload/v1743420939/qqfdgvm9s2et04ewnw2z.jpg"
                            },
                            {
                                "_id": "67f60066b2875095baec8746",
                                "username": "karlinl123",
                                "email": "karlin@mail.com",
                                "fullname": "karlin dan",
                                "createdAt": "2025-04-09T05:06:46.969Z",
                                "updatedAt": "2025-04-09T05:06:46.969Z",
                                "__v": 0
                            },
                            {
                                "_id": "67f6009ab2875095baec874b",
                                "username": "tarif123",
                                "email": "tarif@mail.com",
                                "fullname": "tarif sans",
                                "createdAt": "2025-04-09T05:07:38.952Z",
                                "updatedAt": "2025-04-09T05:07:38.952Z",
                                "__v": 0
                            },
                            {
                                "_id": "67f600cbb2875095baec8750",
                                "username": "ramsen123",
                                "email": "ramsen@mail.com",
                                "fullname": "ramsen brotherhood",
                                "createdAt": "2025-04-09T05:08:27.889Z",
                                "updatedAt": "2025-04-09T05:08:27.889Z",
                                "__v": 0
                            },
                            {
                                "_id": "67f8a59d00f114f1c9d31dba",
                                "username": "gifted30",
                                "email": "info@gifted30.com",
                                "fullname": "gifted30",
                                "createdAt": "2025-04-11T05:16:13.419Z",
                                "updatedAt": "2025-04-11T05:16:13.419Z",
                                "__v": 0
                            },
                            {
                                "_id": "684c6263a9fcb719d9d16a06",
                                "username": "samir123",
                                "email": "samir@mail.com",
                                "fullname": "samir@mail.com",
                                "createdAt": "2025-06-13T17:39:47.271Z",
                                "updatedAt": "2025-06-13T17:39:47.271Z",
                                "__v": 0
                            }
                        ],
                    },
                    "message": "Users fetched successfully.",
                    "success": true
                };
                setGroupData(response.data);
                setFilterMembers(response.data.members);
                //TODO:API CALL
            } catch (error) {

            } finally {

            }
        };
        getGroupInfo();
    }, []);


    const handleEdit = () => setEdit(!edit);

    const handleOnChangeGroupName = (e) => setGroupName(e.target.value);

    const handleSearch = (e) => setFilterMembers(
        groupData.members.filter(user =>
            user.fullname.includes(e.target.vlaue) ||
            user.email.includes(e.target.value)
        ))

    const handleGroupNameEdit = async () => {
        try {
            console.log();
            //TODO:API CALL
            console.log(groupName);
        } catch (error) {
            toast.error(error.response?.data.message || "Something went wrong.");
        } finally {
            setEdit(!edit);
        }
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await auth.updateProfilePicture(file);
            if (response.success) {
                dispatch();
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong while uploading profile");
        }
    }
    console.log(groupData);

    return (
        <dialog id="group-profile" className="modal">
            <div className="modal-box">
                {/* TODO add loader */}
                {/* <GroupProfileModalSkeletion /> */}
                <div className="rounded-xl p-1 space-y-2">
                    <div className="text-center">
                        <h1 className="text-xl font-semibold">Group Information</h1>
                    </div>

                    {/* Image Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                            {/* SELECT GROUP PHOTO */}
                            <div className="relative min-w-fit">
                                <img className="size-20 rounded-full object-cover border-4" src={"user.png"} />
                                <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                    <Camera className="w-5 h-5 text-base-200" />
                                    <input type="file" id="avatar-upload" className="hidden" accept="image/*" />
                                </label>
                            </div>
                            <div className="flex flex-col gap-1 w-full">
                                <div className="text-sm text-zinc-400 flex items-center gap-2">
                                    <Users className="size-4" />Group Name
                                </div>
                                <div className="join w-full">
                                    <input className="input grow input-bordered rounded-r-none text-black" placeholder="text" onChange={handleOnChangeGroupName} value={groupName} disabled={!edit} />
                                    {/*<input className="input grow input-bordered join-item text-black" placeholder="text" onChange={handleOnChangeGroupName} value={groupName} disabled={!edit} /> */}
                                    {!edit &&
                                        <button className="btn text-slate-100 btn-info join-item" onClick={handleEdit}>
                                            <Pen size="18" />Edit
                                        </button>}

                                    {edit &&
                                        <button className="btn text-slate-100 btn-success join-item" onClick={handleGroupNameEdit}>
                                            <Check size="18" />Save
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
                            <input type="text" className="grow" placeholder="Search" onChange={handleSearch} />
                            <Search className="size-6" />
                        </label>
                        {/* Group Members */}
                        <div className="mt-4 overflow-y-auto w-full h-72 border border-base-300 rounded-lg">

                            {filterMembers.map(user => (
                                <div key={user._id} className="flex justify-between items-center hover:bg-base-200 rounded-lg px-2">
                                    <div className="w-full p-3 flex items-center gap-3 transition-colors">
                                        <div className="relative lg:mx-0">
                                            {/* profile image */}
                                            <img className="size-12 object-cover rounded-full" src={"./user.png"} alt={"user profile"} />
                                        </div>
                                        {/* user info*/}
                                        <div className={`block text-left min-w-0`}>
                                            <div className="text-sm sm:text-md font-medium truncate">{truncateText(user.fullname, 12)}</div>
                                            <div className="text-xs sm:text-sm text-zinc-400">
                                                {truncateText(user.email, 14)}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="btn btn-error btn-sm text-base-100">
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        {/* <button className="btn">Close</button> */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                </div>
            </div>

        </dialog>);
}