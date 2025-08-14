import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["sent", "delivered", "read"],
    default: "sent",
  }
}, { timestamps: true });

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;