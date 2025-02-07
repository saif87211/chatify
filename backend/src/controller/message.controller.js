import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";

const getUsersForSideBar = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    return res.status(200).json(new ApiResponse(200, { users }, "Users fetched successfully."))
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

    const receiverId = req.params.id;
    const senderId = req.user._id;

    let cloudinaryResponse;
    if (imageLocalPath) {
        cloudinaryResponse = await uploadFileOnCloudinary(imageLocalPath);
    }

    const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: cloudinaryResponse?.url,
    });

    //TODO: SOCKET implementation

    return res.status(200).json(new ApiResponse(200, { newMessage }));
});

export { getUsersForSideBar, getMessages, sendMessage };