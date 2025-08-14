import express from "express";
import { getMessages, sendMessage } from "../controller/messageController.js";
import isAuth from "../middleware/isAuth.js";

const messagerouter = express.Router();

// Send message to a receiver (protected route)
messagerouter.post("/send/:receiver", isAuth, sendMessage);
messagerouter.get("/get/:receiver", isAuth, getMessages);

export default messagerouter;