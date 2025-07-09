import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import {
    createGroup, getGroupMessages, addUserInGroup,
    sendMessageToGroup, getGroupInfo, removeUserFormGroup,
    leftGroup, updateGroupName, updateGroupProfilePicture,
    addMembersInGroup
} from "../controller/group.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-group").post(verifyJwt, upload.single("image"), createGroup);

router.route("/group-messages/:id").get(verifyJwt, getGroupMessages);

router.route("/send/:id").post(verifyJwt, upload.single("image"), sendMessageToGroup);

router.route("/get-group/:id").get(verifyJwt, getGroupInfo);

router.route("/add-user").post(verifyJwt, addUserInGroup);

router.route("/add-members").post(verifyJwt, addMembersInGroup);

router.route("/update-group-profilepic/:id").patch(verifyJwt, upload.single("profilephoto"), updateGroupProfilePicture);

router.route("/update-groupname").patch(verifyJwt, updateGroupName);

router.route("/left-group/:id").post(verifyJwt, leftGroup);

router.route("/remove-user").post(verifyJwt, removeUserFormGroup);

export default router;