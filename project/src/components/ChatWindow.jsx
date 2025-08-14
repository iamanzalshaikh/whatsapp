import React, { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { MessageContext } from "../context/MessageContext";

const ChatWindow = ({ selectedUser, onBackClick }) => {
  const { currentUser } = useContext(AuthContext);
  const { messages, getMessages, sendMessage } = useContext(MessageContext);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedUser?._id) getMessages(selectedUser._id);
  }, [selectedUser, getMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[selectedUser?._id]]);

  if (!selectedUser) return (
    <div className="flex items-center justify-center h-full text-gray-500">
      Select a user to start chatting
    </div>
  );

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await sendMessage(selectedUser._id, newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
      // Optional: Show error to user
    }
  };

  // ✅ FIXED: Handle Enter key properly
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent form submission or line break
      handleSend();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white p-3 border-b flex items-center shadow-sm">
        <button
          onClick={onBackClick}
          className="mr-3 md:hidden text-gray-600 hover:text-gray-800"
        >
          ←
        </button>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
            {selectedUser.userName?.charAt(0).toUpperCase()}
          </div>
          <h2 className="font-semibold text-gray-800">{selectedUser.userName}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {(messages[selectedUser._id] || []).length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No messages yet. Start the conversation! 👋
          </div>
        ) : (
          (messages[selectedUser._id] || []).map((msg, idx) => {
            const isCurrentUser = msg.sender === currentUser._id;
            return (
              <div
                key={msg._id || idx}
                className={`mb-3 flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none shadow-sm"
                  }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${isCurrentUser ? "text-green-100" : "text-gray-500"
                    }`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={!selectedUser}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim() || !selectedUser}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-6 py-2 rounded-full font-medium transition-colors duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;