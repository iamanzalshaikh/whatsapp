import mongoose from "mongoose";
import Conversation from "../models/conversation.js";
import Message from "../models/message.js";
import { getReceiverSocketId, getIO } from "../socket.js";

export const sendMessage = async (req, res) => {
  try {
    const sender = req.userId;
    let { receiver } = req.params;
    const { message } = req.body;

    if (!receiver) {
      return res.status(400).json({ message: "Receiver ID is required in params" });
    }
    receiver = receiver.trim();

    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    if (!message || message.trim() === "") {
      return res.status(400).json({ message: "Message text is required" });
    }

    // Find existing conversation between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    });

    // Create new message document
    const newMessage = await Message.create({
      sender,
      receiver,
      message,
      status: "sent",
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [sender, receiver],
        messages: [newMessage._id],
      });
    } else {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }

    // Emit message to receiver via socket
    const io = getIO();
    const receiverSocketId = getReceiverSocketId(receiver);
    if (io && receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send message error:", error);
    return res.status(500).json({ message: `Send message error: ${error.message}` });
  }
};

export const getMessages = async (req, res) => {
  try {
    const sender = req.userId;
    let { receiver } = req.params;

    if (!receiver) {
      return res.status(400).json({ message: "Receiver ID is required in params" });
    }
    receiver = receiver.trim();

    if (!mongoose.Types.ObjectId.isValid(sender) || !mongoose.Types.ObjectId.isValid(receiver)) {
      return res.status(400).json({ message: "Invalid sender or receiver ID" });
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [sender, receiver] },
    }).populate({
      path: "messages",
      populate: [
        { path: "sender", select: "userName email" },
        { path: "receiver", select: "userName email" },
      ],
      options: { sort: { createdAt: 1 } },
    });

    if (!conversation) {
      return res.status(200).json([]); // no messages
    }

    return res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return res.status(500).json({ message: `Get messages error: ${error.message}` });
  }
};