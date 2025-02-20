import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js"; // handle files
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); // receving data, so post

router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

export default router;
