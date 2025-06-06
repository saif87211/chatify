import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { createGroup, getGroupMessages, addUserInGroup, sendMessageToGroup } from "../controller/group.controller.js";

const router = Router();

router.route("/").post(verifyJwt, createGroup);

router.route("/messages/:id").get(verifyJwt, getGroupMessages);

// router.route("/send/:id").post(verifyJwt, sendMessageToGroup);

router.route("/remove-user").post(verifyJwt, addUserInGroup);
export default router;