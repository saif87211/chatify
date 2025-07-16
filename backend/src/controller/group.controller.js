import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFileOnCloudinary } from "../utils/cloudinary.js";
import { Group } from "../models/group.model.js";
import { User } from "../models/user.model.js";
import { io } from "../app.js";
import { emitSocketEvent, getReceiverSocketId, socketEvents } from "../socket.js";

const createGroup = asyncHandler(async (req, res) => {
    const groupname = req.body.groupname?.trim();
    const members = req.body.members;
    const admin = req.user._id;
    const imageLocalPath = req.file?.path;

    if (!groupname && !members.length) {
        throw new ApiError(500, "Group name or members is required.");
    }
    let newImageUrl;
    if (imageLocalPath) {
        newImageUrl = await uploadFileOnCloudinary(imageLocalPath);
    }

    const group = await Group.create({ name: groupname, members, admin, profilephoto: newImageUrl?.url });

    if (!group) {
        throw new ApiError(500, "Something went wrong while creating group.");
    }
    const updatedGroup = await Group.findById(group.id).populate("members");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

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
    await newMessage.populate("senderId", "fullname username email profilephoto");

    io.to(newMessage.groupId.toString()).emit(socketEvents.GROUP_MESSAGE, newMessage);

    return res.status(200).json(new ApiResponse(200, { newMessage }));
});

const getGroupMessages = asyncHandler(async (req, res) => {
    const groupId = req.params?.id;

    if (!groupId) {
        throw new ApiError(400, "Group user id required");
    }

    const messages = await Message
        .find({ groupId })
        .populate("senderId", "fullname username email profilephoto");

    if (!messages) {
        throw new ApiError(500, "Internal server error");
    }

    return res.status(200).json(new ApiResponse(200, { messages }, "Message fetched succefully."));
});

const addUserInGroup = asyncHandler(async (req, res) => {
    const { groupId, emailOfUserToAdd } = req.body;
    const currentUserId = req.user._id;

    if (!groupId && !emailOfUserToAdd) {
        throw new ApiError((400, "Invalid group id or User id provided."));
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const userToBeAdd = await User.find({ email: emailOfUserToAdd });

    if (!userToBeAdd.length) {
        throw new ApiError(400, "User not exist.");
    }
    const isCurrentUserAdmin = group.admin.toString() === currentUserId.toString();

    if (!isCurrentUserAdmin) {
        throw new ApiError(403, "Forbidden: Only Admin can add members.")
    }

    const isUserAlreadyInGroup = group.members.includes(userToBeAdd[0]._id);

    if (isUserAlreadyInGroup) {
        throw new ApiError(400, "User is already in the group.");
    }

    group.members.push(userToBeAdd[0]._id);

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    return res.status(200).json(new ApiResponse(200, updatedGroup, "User is added to group."));
});

const removeUserFormGroup = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id;

    const { groupId, userIdToRemove } = req.body;

    if (!groupId && !userIdToRemove) {
        throw new ApiError((400, "Invalid group id or User id provided."));
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const isCurrentUserAdmin = group.admin.toString() === currentUserId.toString();

    if (!isCurrentUserAdmin) {
        throw new ApiError(403, "Forbidden: Only Admin can remove members.")
    }

    const userToBeRemoved = await User.findById(userIdToRemove);
    if (!userToBeRemoved) {
        throw new ApiError(400, "User not exist.");
    }
    group.members = group.members.filter((userId) => userId.toString() !== userToBeRemoved._id.toString());

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    const socketId = getReceiverSocketId(userToBeRemoved._id);
    if (socketId) {
        io.to(socketId).emit(socketEvents.GROUP_DELETE, { groupId: updatedGroup._id });
    }

    return res.status(200).json(new ApiResponse(200, updatedGroup, "User is removed from the group."));
});

const leftGroup = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const groupId = req.params.id;

    if (!groupId) {
        throw new ApiError((400, "Invalid group id provided."));
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(400, "User not found.");
    }

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    const isUserAdmin = group.members.includes(user._id.toString());

    if (isUserAdmin && group.members.length > 2) {
        group.admin = group.members[1]._id;
    }

    if (group.members.length === 1) {
        await Message.deleteMany({ groupId: group._id });
        await Group.findByIdAndDelete(group._id);

        emitSocketEvent(io, socketEvents.GROUP_DELETE, { groupId: group._id });

        return res.status(200).json(new ApiResponse(200, {}, "Group deleted succefully."));
    }

    group.members = group.members.filter(memberId => memberId.toString() !== userId.toString());

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    const socketId = getReceiverSocketId(user._id);
    if (socketId) {
        io.to(socketId).emit(socketEvents.GROUP_DELETE, { groupId: updatedGroup._id });
    }

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

const getGroupInfo = asyncHandler(async (req, res) => {
    const groupId = req.params.id;

    if (!groupId) {
        throw new ApiError((400, "Invalid group id provided."));
    }

    const group = await Group.findById(groupId).populate("members", "username email fullname profilephoto");

    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    return res.status(200).json(new ApiResponse(200, group, "Group fetched succefully"));
});

const updateGroupName = asyncHandler(async (req, res) => {
    const { groupId, groupName } = req.body;

    if (!groupId && !groupName) {
        throw new ApiError((400, "Invalid group id or group name provided."));
    }

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    group.name = groupName;

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    return res.status(200).json(new ApiResponse(200, group, "Group name updated succefully."));
});

const updateGroupProfilePicture = asyncHandler(async (req, res) => {
    const imageLocalPath = req.file?.path;

    const groupId = req.params.id;

    if (!imageLocalPath) {
        throw new ApiError(400, "Profile picture is missing.");
    }

    const newImageUrl = await uploadFileOnCloudinary(imageLocalPath);

    const group = await Group.findById(groupId);

    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    group.profilephoto = newImageUrl.url;

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    await updatedGroup.populate("members", "username email fullname profilephoto");

    return res.status(200).json(new ApiResponse(200, updatedGroup, "Group profile picture updated succefully."));
});


const addMembersInGroup = asyncHandler(async (req, res) => {
    const { groupId, membersIds } = req.body;

    if (!groupId && !membersIds) {
        throw new ApiError((400, "Invalid group id or members id provided."));
    }

    const group = await Group.findById(groupId);
    if (!group) {
        throw new ApiError(400, "Group not found.");
    }

    membersIds.forEach(memberId => {
        if (!group.members.includes(memberId)) {
            group.members.push(memberId);
        }
    });

    await group.save();

    const updatedGroup = await Group.findById(group._id).populate("members", "-password");

    emitSocketEvent(io, socketEvents.GROUP_UPDATE, updatedGroup);

    return res.status(200).json(new ApiResponse(200, updatedGroup, "Members are added to the group."));
});

export {
    createGroup, getGroupMessages, sendMessageToGroup,
    addUserInGroup, removeUserFormGroup, leftGroup,
    deleteGroup, updateGroupName, updateGroupProfilePicture,
    getGroupInfo, addMembersInGroup
};