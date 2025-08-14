import express from "express";
import { getCurrentUser, getOtherUsers, search } from "../controller/userController.js";
import isAuth from "../middleware/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/others", isAuth, getOtherUsers);
userRouter.get("/search", isAuth, search);

export default userRouter;