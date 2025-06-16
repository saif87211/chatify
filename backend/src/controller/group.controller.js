import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { io } from "../app.js";
import { getReceiverSocketId } from "../socket.js";

const createGroup = asyncHandler(async (req, res) => {
    const groupname = req.body.groupname?.trim();
    const members = req.body.members;
    const admin = req.user._id;

    if (!groupname && !members.length) {
        throw new ApiError(500, "Group name or members is required.");
    }
    const group = await Group.create({ name: groupname, members, admin });

    if (!group) {
        throw new ApiError(500, "Something went wrong while creating group.");
    }

    return res.status(201).json(new ApiResponse(201, { group }, "Group Created Succefully."));
});


const sendMessageToGroup = asyncHandler(async (req, res) => {
    const text = req.body.text;
    const imageLocalPath = req.file?.path;
    
    const groupId = req.params.id;
    const senderId = req.user._id;

    let cloudinaryResponse;
    if (imageLocalPath) {
        cloudinaryResponse = await uploadFileOnCloudinary(imageLocalPath);
    }
    const newMessage = await Message.create({
        senderId,
        groupId,
        text,
        image: cloudinaryResponse?.url,
    });
    
    //TODO: SOCKET implementation

    await newMessage.populate("senderId","fullname username email");

    io.to(newMessage.groupId.toString()).emit("groupMessage", newMessage);
    
    return res.status(200).json(new ApiResponse(200, { newMessage }));
});

const getGroupMessages = asyncHandler(async (req, res) => {
    const groupId = req.params?.id;

    if (!groupId) {
        throw new ApiError(400, "Group user id required");
    }

    const messages = await Message
        .find({ groupId })
        .populate("senderId","fullname username email");

    if (!messages) {
        throw new ApiError(500, "Internal server error");
    }

    return res.status(200).json(new ApiResponse(200, { messages }, "Message fetched succefully."));
});

const addUserInGroup = asyncHandler(async (req, res) => {
    const { groupId, userIdToAdd } = req.body;
    const currentUserId = req.User._id;

    if (!groupId && !userIdToAdd) {
        throw new ApiError((400, "Invalid group id or User id provided."));
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const userToBeAdd = await User.findById(userIdToAdd);
    if (!userToBeAdd) {
        throw new ApiError(400, "User not exist found.");
    }

    const isCurrentUserAdmin = group.members.include(currentUserId);

    if (!isCurrentUserAdmin) {
        throw new ApiError(403, "Forbidden: Only Admin can add members.")
    }

    group.members.push(userToBeAdd._id);

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("user");

    return res.status(200).json(new ApiResponse(200, { updatedGroup }, "User is added to group."));
});

const removeUserFormGroup = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;

    const { groupId, userIdToRemove } = req.body;

    if (!groupId && !userIdToRemove) {
        throw new ApiError((400, "Invalid group id or User id provided."));
    }

    const group = await Group.findById(groupId);
    if (group) {
        throw new ApiError(400, "Group not found.");
    }

    const isCurrentUserAdmin = group.members.include(currentUserId);

    if (isCurrentUserAdmin) {
        throw new ApiError(403, "Forbidden: Only Admin can remove members.")
    }

    const userToBeRemoved = await User.findById(userIdToRemove);
    if (userToBeRemoved) {
        throw new ApiError(400, "User not exist.");
    }

    group.members.filter((userId) => userId !== userToBeRemoved._id);

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("user");

    return res.status(200).json(new ApiResponse(200, { updatedGroup }, "User is removed from the group."));
});

const leftGroup = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const groupId = req.body.groupId;

    if (!groupId) {
        throw new ApiError((400, "Invalid group id provided."));
    }

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const isUserAdmin = group.members.include(userId);

    if (isUserAdmin) {
        group.admin = group.members[1]._id;
    }
    group.members = group.members.filter(memberId => memberId !== userId);

    await group.save();

    const updatedGroup = await Group.findById(group._id);

    return res.status(200).json(new ApiResponse(200, updatedGroup, "You left the group."));
});


const deleteGroup = asyncHandler(async (req, res) => {
    const groupId = req.body.groupId;

    if (!groupId) {
        throw new ApiError((400, "Invalid group id provided."));
    }

    await Group.findByIdAndDelete(groupId);

    const groups = await Group.find();

    return res.status(200).json(new ApiResponse(200, groups, "Group deleted succefully."));

});

export { createGroup, getGroupMessages, sendMessageToGroup, addUserInGroup, removeUserFormGroup, leftGroup, deleteGroup };