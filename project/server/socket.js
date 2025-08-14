import { Server } from "socket.io";

let io;
const userSocketMap = {};

export function initSocket(server) {
  io = new Server(server, {
    cors: {
  origin: "https://saldapaldwde.netlify.app",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🆕 Socket connected:", socket.id);

    const userId = socket.handshake.auth?.userId;
    console.log("📌 UserId from handshake:", userId);

    if (userId) {
      // If same user already exists, remove old mapping
      if (userSocketMap[userId]) {
        console.log(`♻ Replacing old socket for user ${userId}`);
        delete userSocketMap[userId];
      }
      userSocketMap[userId] = socket.id;
      console.log(`✅ User ${userId} mapped to socket ${socket.id}`);
    } else {
      console.warn("⚠ No userId found in socket handshake");
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle sending message
    socket.on("sendMessage", (messageData) => {
      console.log("📩 New message event:", messageData);

      const receiverSocketId = getReceiverSocketId(messageData.receiver);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", messageData);
        console.log(`📤 Sent to receiver ${messageData.receiver}`);
      } else {
        console.log(`📭 Receiver ${messageData.receiver} is offline`);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      if (userId && userSocketMap[userId] === socket.id) {
        delete userSocketMap[userId];
        console.log(`🗑 Removed mapping for user ${userId}`);
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
      }
    });
  });

  return io;
}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

export function getIO() {
  return io;
}
