import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { SocketContext } from "./SocketContext";

export const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const { serverUrl, currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const [messages, setMessages] = useState({});

  const normalizeMessage = (msg) => {
    // Always make sender and receiver as ID strings
    return {
      ...msg,
      sender: msg.sender._id ? msg.sender._id : msg.sender,
      receiver: msg.receiver._id ? msg.receiver._id : msg.receiver,
    };
  };

  const getMessages = useCallback(async (receiverId) => {
    if (!receiverId) return [];
    try {
      const res = await axios.get(`${serverUrl}/api/messages/get/${receiverId}`, {
        withCredentials: true,
      });
      const msgs = res.data.map(normalizeMessage);
      setMessages((prev) => ({
        ...prev,
        [receiverId]: msgs,
      }));
      return msgs;
    } catch (err) {
      console.error("Failed to get messages:", err);
      return [];
    }
  }, [serverUrl]);

  const sendMessage = async (receiverId, messageText) => {
    if (!receiverId || !messageText.trim()) return;

    try {
      const res = await axios.post(`${serverUrl}/api/messages/send/${receiverId}`, {
        message: messageText.trim(),
      }, { withCredentials: true });

      const newMessage = normalizeMessage(res.data);

      // Update local state for sender
      setMessages((prev) => ({
        ...prev,
        [receiverId]: [...(prev[receiverId] || []), newMessage],
      }));

      // ❌ REMOVE THIS LINE - Don't emit via socket from client!
      // The server already handles socket emission in sendMessage controller
      // if (socket) socket.emit("sendMessage", newMessage);

      return newMessage;
    } catch (err) {
      console.error("Failed to send message:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (!socket || !currentUser) return;

    const handleIncoming = (msg) => {
      console.log("📨 Received socket message:", msg);
      const message = normalizeMessage(msg);

      // Only add to state if this message is for the current user as receiver
      // Don't add messages that current user sent (those are already in state)
      if (message.receiver === currentUser._id && message.sender !== currentUser._id) {
        const chatId = message.sender; // The sender becomes the chat ID

        setMessages((prev) => ({
          ...prev,
          [chatId]: [...(prev[chatId] || []), message],
        }));
      }
    };

    socket.on("newMessage", handleIncoming);

    return () => socket.off("newMessage", handleIncoming);
  }, [socket, currentUser]);

  return (
    <MessageContext.Provider value={{ messages, getMessages, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;