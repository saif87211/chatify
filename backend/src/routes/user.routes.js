import { Router } from "express";
import {
    register,
    login,
    logout,
    changeCurrentPassword,
    getCurrentUser,
    updateUserAccountDetails,
    updateUserProfileImage
} from "../controller/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/login").post(login);

router.route("/register").post(register);

//secure routes

router.route("/logout").post(verifyJwt, logout);

router.route("/change-password").post(verifyJwt, changeCurrentPassword);

router.route("/getuser").post(verifyJwt, getCurrentUser);

router.route("/update-user").patch(verifyJwt, updateUserAccountDetails);

router.route("/profilephoto").patch(verifyJwt, upload.single("profilephoto"), updateUserProfileImage);

export default router;