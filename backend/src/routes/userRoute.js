import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateName,
  updatePassword,
  updateAvatar,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/update-name", authUser, updateName);
userRouter.post("/update-password", authUser, updatePassword);
userRouter.post("/update-avatar", authUser, upload.single("image"), updateAvatar);

export default userRouter;
