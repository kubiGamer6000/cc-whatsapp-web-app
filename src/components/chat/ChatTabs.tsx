import React, { useState } from 'react';
import { Chat } from '../../types';
import { Users, User } from 'lucide-react';

interface ChatTabsProps {
  chats: Chat[];
  selectedChat: Chat | null;
  loading: boolean;
  onSelectChat: (chat: Chat) => void;
}

const ChatTabs: React.FC<ChatTabsProps> = ({ 
  chats, 
  selectedChat, 
  loading, 
  onSelectChat 
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'group'>('all');
  
  // Filter and sort chats based on the active tab
  const filteredChats = chats.filter(chat => {
    if (activeTab === 'all') return true;
    if (activeTab === 'direct') return !chat.isGroup;
    if (activeTab === 'group') return chat.isGroup;
    return true;
  });
  
  // Sort chats: first by having a last message (most recent first), then by name
  const sortedChats = [...filteredChats].sort((a, b) => {
    // First sort by last message timestamp (most recent first)
    if (a.lastMessage?.timestamp && b.lastMessage?.timestamp) {
      return b.lastMessage.timestamp - a.lastMessage.timestamp;
    }
    
    // If only one has a last message, prioritize it
    if (a.lastMessage?.timestamp) return -1;
    if (b.lastMessage?.timestamp) return 1;
    
    // Then sort by name (unnamed chats at the bottom)
    const aName = a.name || '';
    const bName = b.name || '';
    
    if (!aName && !bName) return 0;
    if (!aName) return 1; // Move unnamed chats to the bottom
    if (!bName) return -1;
    
    return aName.localeCompare(bName);
  });
  
  return (
    <div className="h-full flex flex-col bg-gray-800 border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-gray-200">Chats</h2>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-2 text-sm font-medium ${
            activeTab === 'all' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center ${
            activeTab === 'direct' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('direct')}
        >
          <User size={14} className="mr-1" />
          Direct
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium flex items-center justify-center ${
            activeTab === 'group' 
              ? 'text-blue-400 border-b-2 border-blue-400' 
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('group')}
        >
          <Users size={14} className="mr-1" />
          Groups
        </button>
      </div>
      
      {loading && sortedChats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading chats...</p>
        </div>
      ) : sortedChats.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">No {activeTab === 'all' ? '' : activeTab} chats found</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {sortedChats.map(chat => (
            <button
              key={chat.id}
              className={`w-full p-4 text-left hover:bg-gray-700 transition-colors ${
                selectedChat?.id === chat.id ? 'bg-gray-700' : ''
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-200 truncate">
                    {typeof chat.name === 'string' && chat.name.trim() ? chat.name : 'Unnamed Chat'}
                  </p>
                  {chat.lastMessage?.text && (
                    <p className="text-sm text-gray-400 truncate">
                      {chat.lastMessage.text}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      {chat.isGroup ? 'Group' : 'Direct Message'}
                    </p>
                    {chat.lastMessage?.timestamp && (
                      <p className="text-xs text-gray-500">
                        {new Date(chat.lastMessage.timestamp * 1000).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatTabs;