import { Router } from "express";
import { registerUser } from "../controllers/user.controllers";
import { upload } from "../middlewares/multer.middlewares";

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

export default router;
