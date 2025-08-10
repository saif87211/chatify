import { Camera, Mail } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/authSlice";
import { toast } from "react-hot-toast";
import auth from "../api/auth";

export default function Profile() {
    const userData = useSelector(state => state.authSlice.authUserData);
    const dispatch = useDispatch();
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            const response = await auth.updateProfilePicture(file);
            if (response.success) {
                dispatch(login(response.data));
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data.message || "Something went wrong while uploading profile");
        }
    }
    return (
        <div className="pt-20">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-base-300 rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold">Profile</h1>
                        <p className="mt-2">Your profile information</p>
                    </div>
                    {/* Image Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                            <img className="size-32 rounded-full object-cover border-4" src={userData?.profilephoto || "user.png"} />
                            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer transition-all duration-200">
                                <Camera className="w-5 h-5 text-base-200" />
                                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={handleImageUpload} />
                            </label>
                        </div>
                        <p className="text-sm text-zinc-600">Click the camera icon to update your photo</p>
                    </div>

                    {/* User Details */}
                    <div className="space-y-1.5">
                        <div className="text-sm text-zinc-400 flex items-center gap-2">
                            <Mail className="w-4 h-4" />Email Address
                        </div>
                        <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{userData?.email}</p>
                    </div>
                </div>

                <div className="mt-6 bg-base-300 rounded-xl p-6">
                    <h2 className="text-lg font-medium  mb-4">Account Information</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                            <span>Member Since</span>
                            <span>{userData?.createdAt.split("T")[0]}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span>Account Status</span>
                            <span className="text-green-500">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}