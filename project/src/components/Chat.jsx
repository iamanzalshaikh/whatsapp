import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import ContactList from './ContactList';
import ChatWindow from './ChatWindow';
import { MessageCircle, LogOut, Menu, X } from 'lucide-react';

const Chat = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // Active chat user

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Sidebar Header */}
        <div className="bg-green-600 text-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-semibold">
                  {currentUser?.name || currentUser?.userName}
                </h2>
                <p className="text-sm text-green-100">@{currentUser?.userName}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors md:hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contact List */}
        <div className="h-full pb-20">
          <ContactList
            onSelectUser={(user) => {
              setSelectedUser(user);
              closeSidebar();
            }}
            activeUser={selectedUser}
          />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden bg-green-600 text-white p-4 flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors mr-3"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6" />
            <h1 className="text-lg font-semibold">Chat</h1>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1">
          {selectedUser ? (
            <ChatWindow
              selectedUser={selectedUser}
              onBackClick={closeSidebar}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a contact to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
