import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createGroup, getGroupMessages, addUserInGroup, sendMessageToGroup } from "../controller/group.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create-group").post(verifyJwt, createGroup);

router.route("/group-messages/:id").get(verifyJwt, getGroupMessages);

router.route("/send/:id").post(verifyJwt,upload.single("image"), sendMessageToGroup);

router.route("/remove-user").post(verifyJwt, addUserInGroup);
export default router;