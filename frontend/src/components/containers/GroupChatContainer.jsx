import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState, useCallback } from "react";
import toast from "react-hot-toast";
import chatService from "../../api/chat";
import { setMessages, resetSelectedUserOrGroup } from "../../slices/chatSlice";
import { GroupChatHeader, MessageSkeletion, MessageInput } from "../index";
import { useSocket, socketEvents } from "../../context/SocketContext";
import { formatMessageTime } from "../../utils/helper";

export default function GroupChatContainer() {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.chatSlice.messages);
    const authUser = useSelector(state => state.authSlice.authUserData);
    const groupData = useSelector(state => state.chatSlice.groupData);
    const [isMessagesLoading, setIsMessagesLoading] = useState(false);
    const [typingUserId, setTypingUserId] = useState(null);
    const selectedGroup = useSelector(state => state.chatSlice.selectedUserOrGroup);
    const messageEndRef = useRef(null);
    const socket = useSocket();

    const handleGroupMessage = useCallback((newGroupMessage) => {
        if (newGroupMessage.senderId._id !== authUser._id)
            dispatch(setMessages([...messages, newGroupMessage]));
    }, [selectedGroup, messages, dispatch]);

    useEffect(() => {
        const getMessages = async () => {
            setIsMessagesLoading(true);
            try {
                const response = await chatService.getGroupMessages(selectedGroup._id);
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
    }, [selectedGroup, dispatch]);

    useEffect(() => {
        if (!socket) return;
        socket.emit(socketEvents.JOIN_GROUP_CHAT, selectedGroup._id);
        socket.on(socketEvents.GROUP_MESSAGE, handleGroupMessage);

        socket.on(socketEvents.GROUP_USER_TYPING, (data) => {
            setTypingUserId(data.userId);
        });
        socket.on(socketEvents.GROUP_USER_STOP_TYPING, (data) => {
            setTypingUserId(null);
        });


        return () => {
            if (!socket) return;
            socket.off(socketEvents.GROUP_MESSAGE);
            socket.off(socketEvents.GROUP_USER_TYPING);
            socket.off(socketEvents.GROUP_USER_STOP_TYPING);
            socket.emit(socketEvents.LEAVE_GROUP_CHAT, selectedGroup._id);
        };
    }, [socket, selectedGroup, dispatch]);

    useEffect(() => {
        if (messageEndRef.current) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isMessagesLoading, typingUserId]);

    const findUserName = (userId) => {
        const user = groupData?.members.find(member => member._id === userId)
        return user.fullname;
    };

    return (isMessagesLoading ? (
        <div className="flex-1 flex flex-col overflow-auto">
            <GroupChatHeader />
            <MessageSkeletion />
            <MessageInput />
        </div>) :
        (<div className="flex-1 flex flex-col overflow-auto">
            <GroupChatHeader />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* messages */}
                {messages && messages.map(message => (
                    <div key={message._id} className={`chat ${message.senderId._id === authUser._id ? "chat-end" : "chat-start"}`}>
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <img className="" src={message.senderId.profilephoto || "./user.png"} alt="profile pic" />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            {message.senderId.fullname}
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
                {typingUserId ? (<div className="chat-start">
                    <div className="chat-header mb-1">
                        {findUserName(typingUserId)}
                    </div>
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

