import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { io } from "../app.js";
import { getReceiverSocketId } from "../socket.js";
import { Group } from "../models/group.model.js";

const getUsersAndGroupsForSideBar = asyncHandler(async (req, res) => {
    const currentUserId = req.user?._id;
    //get all the user except current user
    const users = await User.find({ _id: { $ne: currentUserId } }).select("-password");
    const groups = await Group.find({
        $or: [
            { admin: currentUserId },
            {
                members: {
                    $in: [currentUserId]
                }
            }]
    });

    return res.status(200).json(new ApiResponse(200, [...users, ...groups], "Users fetched successfully."))
});

const getMessages = asyncHandler(async (req, res) => {
    const receiverUserId = req.params?.id;
    const currentUserId = req.user?._id;

    if (!receiverUserId) {
        throw new ApiError(400, "Other user id required");
    }

    const messages = await Message.find({
        $or: [
            { senderId: currentUserId, receiverId: receiverUserId },
            { senderId: receiverUserId, receiverId: currentUserId }
        ]
    });

    if (!messages) {
        throw new ApiError(500, "Internal server error");
    }

    return res.status(200).json(new ApiResponse(200, { messages }, "Messages fetched succefully."));
});

const sendMessage = asyncHandler(async (req, res) => {
    const text = req.body.text;
    const imageLocalPath = req.file?.path;

    const { receiverId, groupId } = req.body;
    const senderId = req.user._id;

    let cloudinaryResponse;
    if (imageLocalPath) {
        cloudinaryResponse = await uploadFileOnCloudinary(imageLocalPath);
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        groupId,
        text,
        image: cloudinaryResponse?.url,
    });
    console.log(receiverId, "receiverId");
    //TODO: SOCKET implementation
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log("receiverSocketId:", receiverSocketId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(200).json(new ApiResponse(200, { newMessage }));
});

export { getUsersAndGroupsForSideBar, getMessages, sendMessage };