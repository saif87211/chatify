import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { resetSelectedUserOrGroup } from "../slices/chatSlice";

export default function ChatHeader() {
    const selectedUserOrGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const dispatch = useDispatch();

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Profile */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <img src={selectedUserOrGroup?.profilephoto || "./user.png"} alt={selectedUserOrGroup?.username || "user profile"} />
                        </div>
                    </div>
                    {/* user info */}
                    <div>
                        <h3 className="font-medium">{selectedUserOrGroup.fullname || selectedUserOrGroup.name}</h3>
                        <p className="text-sm text-base-content/70">Offline</p>
                    </div>
                </div>
                {/* Close button */}
                <button onClick={() => { dispatch(resetSelectedUserOrGroup()) }}>
                    <X />
                </button>
            </div>
        </div>
    );
}