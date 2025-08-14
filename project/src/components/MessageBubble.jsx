import React from 'react';
import { Check, CheckCheck } from 'lucide-react';

const MessageBubble = ({ message, isOwn }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <Check className="w-4 h-4" />;
      case 'delivered':
        return <CheckCheck className="w-4 h-4" />;
      case 'read':
        return <CheckCheck className="w-4 h-4 text-blue-500" />;
      default:
        return <Check className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          isOwn
            ? 'bg-green-500 text-white rounded-br-md'
            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.message}</p>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${
          isOwn ? 'text-green-100' : 'text-gray-500'
        }`}>
          <span className="text-xs">{formatTime(message.createdAt)}</span>
          {isOwn && (
            <div className="text-green-100">
              {getStatusIcon(message.status)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;