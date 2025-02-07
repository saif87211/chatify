import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import chatService from "../api/chat";
import { setMessages, resetSelectedUser } from "../slices/chatSlice";
import { ChatHeader, MessageSkeletion, MessageInput } from "./index";

const formatMessageTime = (date) => new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

export default function ChatContainer() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chatSlice.messages);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const selectedUser = useSelector(state => state.chatSlice.selectedUser);
    const messageEndRef = useRef(null);
    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            try {
                const response = await chatService.getMessages(selectedUser._id);
                if (response?.data.messages) {
                    dispatch(setMessages(response?.data.messages));
                }
            } catch (error) {
                toast.error("can't load the user messages");
                dispatch(resetSelectedUser());
            } finally {
                setIsMessagesLoading(false);
            }
        }
        getMessages();
    }, [selectedUser]);

    useEffect(() => {
        console.log(messageEndRef.current);
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (isMessagesLoading ? (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <MessageSkeletion />
            <MessageInput />
        </div>) :
        (<div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* messages */}
                {messages && messages.map(message => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img className="" src={message.senderId === authUser._id ? authUser.profilephoto || "./user.png" : selectedUser.profilephoto || "./user.png"} alt="profile pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.image && (
                                <img src={message.image} className="sm:max-w-[200px] rounded-md mb-2" alt="Attachment" />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
            </div>
            <MessageInput />
        </div>
        ));
}

