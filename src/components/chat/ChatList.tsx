import React from 'react';
import { Chat } from '../../types';

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;
  onSelectChat: (chat: Chat) => void;
}

const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  selectedChat, 
  loading, 
  onSelectChat 
}) => {
  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Chats</h2>
      </div>
      
      {loading && chats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading chats...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-700">
          {chats.map(chat => (
            <button
              key={chat.id}
              className={`w-full p-4 text-left hover:bg-gray-700 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="font-medium text-gray-200">{typeof chat.name === 'string' ? chat.name : 'Unnamed Chat'}</p>
                  <p className="text-sm text-gray-400">
                    {chat.isGroup ? 'Group' : 'Direct Message'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;