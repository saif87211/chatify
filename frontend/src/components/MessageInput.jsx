import { useEffect, useRef, useState } from "react";
import { X, Image, Send } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../slices/chatSlice";
import chatService from "../api/chat";
import { socketEvents, useSocket } from "../context/SocketContext";

export default function MessageInput() {
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const selectedUserOrGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const authUserData = useSelector(state => state.authSlice.authUserData);
    const socket = useSocket();
    const disptach = useDispatch();
    const typingTimeOutRef = useRef(null);

    let typingEvent, stopTypingEvent, dataToBeSendViaSocket;

    if (selectedUserOrGroup?.members) {
        typingEvent = socketEvents.GROUP_USER_TYPING;
        stopTypingEvent = socketEvents.GROUP_USER_STOP_TYPING;
        dataToBeSendViaSocket = { groupId: selectedUserOrGroup._id, userId: authUserData._id };
    } else {
        typingEvent = socketEvents.USER_TYPING;
        stopTypingEvent = socketEvents.USER_STOP_TYPING;
        dataToBeSendViaSocket = selectedUserOrGroup;
    }


    useEffect(() => {
        return () => {
            if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
        };
    }, [])

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setSelectedImage(file);
        };
        reader.readAsDataURL(file);
    }

    const handleInputChange = (e) => {
        setText(e.target.value);

        if (!socket) return;

        if (e.target.value.length < 3) return;

        socket.emit(typingEvent, dataToBeSendViaSocket);

        if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);

        typingTimeOutRef.current = setTimeout(() => {
            socket.emit(stopTypingEvent, dataToBeSendViaSocket);
        }, 1000);
    }

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!text.trim() && !imagePreview) return;
        if (socket) {
            if (typingTimeOutRef.current) clearTimeout(typingTimeOutRef.current);
            socket.emit(stopTypingEvent, dataToBeSendViaSocket);
        }
        try {
            let response;
            if (selectedUserOrGroup.members)
                response = await chatService.sendMessageToGroup(selectedUserOrGroup._id, text.trim(), selectedImage);
            else
                response = await chatService.sendMessage(selectedUserOrGroup._id, text.trim(), selectedImage);

            const newMessage = response?.data.newMessage;
            if (newMessage) {
                disptach(setMessages([newMessage]));
            }
            setText("");
            setImagePreview(null);
            setSelectedImage(null);
        } catch (error) {
            console.log(error);
            toast.error("failed to send messages.");
        }
    }

    return (
        <div className="p-4 w-full">
            {imagePreview && (
                <div className="mb-3 flex items-center gap-2">
                    <div className="relative">
                        <img src={imagePreview} className="w-20 h-20 object-cover rounded-lg border border-zinc-700" alt="Preview" />
                        <button className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300" type="button" onClick={removeImage}>
                            <X className="size-3" />
                        </button>
                    </div>
                </div>
            )}

            <form className="flex items-center gap-2" onSubmit={handleSendMessage}>
                <div className="flex-1 flex gap-2">
                    <input type="text" className="w-full input input-bordered rounded-lg input-sm sm:input-md" placeholder="Type a message..." value={text} onChange={handleInputChange}></input>
                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImage} />

                    <button type="button" className={`hidden sm:flex btn btn-circle  ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`} onClick={() => fileInputRef.current?.click()}>
                        <Image size={20} />
                    </button>
                </div>
                <button type="submit" className="btn btn-sm btn-circle" disabled={!text.trim() && !imagePreview}>
                    <Send size={22} />
                </button>
            </form>
        </div>
    );
}