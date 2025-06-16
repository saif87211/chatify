import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import chatService from "../../api/chat";
import { setMessages, resetSelectedUserOrGroup } from "../../slices/chatSlice";
import { ChatHeader, MessageSkeletion, MessageInput } from "../index";
import { useSocket } from "../../context/SocketContext";
import { formatMessageTime } from "../../utils/helper";

export default function UserChatContainer() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chatSlice.messages);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const selectedUser = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const messageEndRef = useRef(null);
    const socket = useSocket();

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
                dispatch(resetSelectedUserOrGroup());
            } finally {
                setIsMessagesLoading(false);
            }
        }
        getMessages();
    }, [selectedUser, dispatch]);

    useEffect(() => {
        if (socket) {
            socket.on("newMessage", (newMessage) => {
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

                if (!isMessageSentFromSelectedUser) return;

                dispatch(setMessages([newMessage]));
            });
        }
        return () => {
            if (socket) {
                socket.off('newMessage');
            }
        };
    }, [socket, selectedUser, dispatch]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isMessagesLoading]);

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
                                <img className="" src={message.senderId === authUser._id ? authUser?.profilephoto || "./user.png" : selectedUser.profilephoto || "./user.png"} alt="profile pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt)}
                            </time>
                        </div>
                        <div className="chat-bubble text-wrap flex flex-col">
                            {message.image && (
                                <img src={message.image} className="sm:max-w-[200px] block rounded-md mb-2" alt="Attachment" />
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

