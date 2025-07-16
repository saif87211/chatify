import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import chatService from "../../api/chat";
import { setMessages, resetSelectedUserOrGroup } from "../../slices/chatSlice";
import { UserChatHeader, MessageSkeletion, MessageInput } from "../index";
import { useSocket, socketEvents } from "../../context/SocketContext";
import { formatMessageTime } from "../../utils/helper";

export default function UserChatContainer() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chatSlice.messages);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [typing, SetTyping] = useState(false);
    const selectedUser = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const messageEndRef = useRef(null);
    const socket = useSocket();

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            try {
                const response = await chatService.getMessages(selectedUser._id);
                if (response?.data.messages && response.data.messages.length !== messages.length) {
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
            socket.on(socketEvents.NEW_MESSAGE, (newMessage) => {
                const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;

                if (!isMessageSentFromSelectedUser) return;

                dispatch(setMessages([newMessage]));
            });
            socket.on(socketEvents.USER_TYPING, () => {
                SetTyping(true);
            });
            socket.on(socketEvents.USER_STOP_TYPING, () => {
                SetTyping(false);
            });
        }
        return () => {
            if (socket) {
                socket.off(socketEvents.NEW_MESSAGE);
                socket.off(socketEvents.USER_TYPING);
                socket.off(socketEvents.USER_STOP_TYPING);
                SetTyping(false);
            }
        };
    }, [socket, selectedUser, dispatch]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
    }, [messages, isMessagesLoading, typing]);

    return (isMessagesLoading ? (
        <div className="flex-1 flex flex-col overflow-auto">
            <UserChatHeader />
            <MessageSkeletion />
            <MessageInput />
        </div>) :
        (<div className="flex-1 flex flex-col overflow-auto">
            <UserChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* messages */}
                {messages && messages.map(message => (
                    <div key={message._id} className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
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
                {typing ? (<div className="chat-start">
                    <div className="chat-bubble text-wrap flex flex-col">
                        <span className="loading loading-dots loading-md"></span>
                    </div>
                </div>) : (null)}
                <div className="size-0 p-0 m-0" ref={messageEndRef}></div>
                {!messages.length && <p className="text-center text-slate-400">No Chats</p>}
            </div>
            <MessageInput />
        </div>
        ));
}

