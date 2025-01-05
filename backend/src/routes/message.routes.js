import { Router } from "express";
import {
    getMessages,
    getUsersForSideBar,
    sendMessage
} from "../controller/message.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/users").get(verifyJwt, getUsersForSideBar);

router.route("/:id").get(verifyJwt, getMessages);

router.route("/send/:id").post(verifyJwt, sendMessage);

export default router;