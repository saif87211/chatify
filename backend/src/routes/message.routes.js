import { Router } from "express";
import {
    getMessages,
    getUsersAndGroupsForSideBar,
    sendMessage
} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/users-and-groups").get(verifyJwt, getUsersAndGroupsForSideBar);

router.route("/:id").get(verifyJwt, getMessages);

router.route("/send/:id").post(verifyJwt, upload.single("image"), sendMessage);

export default router;