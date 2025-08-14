import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { SocketContext } from '../context/SocketContext';
import { Search, User, Circle } from 'lucide-react';

const ContactList = ({ onSelectUser, activeUser }) => {
  const { otherUsers, loading, searchUsers } = useContext(UserContext);
  const { onlineUsers } = useContext(SocketContext);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      const results = await searchUsers(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const displayUsers = searchQuery.trim() ? searchResults : otherUsers;

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId);
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {isSearching ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
          </div>
        ) : displayUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <User className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-center">
              {searchQuery.trim() ? 'No users found' : 'No contacts available'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayUsers.map((user) => (
              <div
                key={user._id}
                onClick={() => onSelectUser(user)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${activeUser?._id === user._id
                    ? 'bg-green-50 border-r-4 border-green-500'
                    : ''
                  }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.userName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-600" />
                    )}
                  </div>
                  {isUserOnline(user._id) && (
                    <Circle className="absolute -bottom-1 -right-1 w-4 h-4 text-green-500 fill-current" />
                  )}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {user.name || user.userName}
                    </h3>
                    {isUserOnline(user._id) && (
                      <span className="text-xs text-green-500 font-medium">Online</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">@{user.userName}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactList;
