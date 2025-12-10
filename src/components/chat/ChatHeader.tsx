import React from 'react';
import { ArrowLeft, MessageSquare, Terminal, LogOut } from 'lucide-react';
import { User } from '../../types';

interface ChatHeaderProps {
  currentUser: User | null;
  isMobileView: boolean;
  showChatList: boolean;
  onBackToChats?: () => void;
  onBackToDashboard: () => void;
  onSignOut: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  currentUser,
  isMobileView,
  showChatList,
  onBackToChats,
  onBackToDashboard,
  onSignOut
}) => {
  return (
    <header className="bg-gray-800 shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            {isMobileView && !showChatList && onBackToChats && (
              <button 
                onClick={onBackToChats}
                className="mr-3 p-1 rounded-full hover:bg-gray-700"
              >
                <ArrowLeft size={20} className="text-gray-400" />
              </button>
            )}
            <MessageSquare className="h-8 w-8 text-blue-500 mr-3" />
            <h1 className="text-xl font-bold text-gray-100">WhatsApp Messages</h1>
          </div>
          <div className="flex items-center space-x-2">
            {currentUser && (
              <div className="flex items-center mr-4">
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt={currentUser.displayName || 'User'} 
                    className="h-8 w-8 rounded-full mr-2"
                  />
                )}
                <span className="text-sm text-gray-300 hidden md:inline">
                  {currentUser.displayName || ''}
                </span>
              </div>
            )}
            
            <button
              onClick={onBackToDashboard}
              className="px-3 py-1 rounded text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 flex items-center"
            >
              <Terminal size={14} className="mr-1" />
              Logs
            </button>
            
            <button
              onClick={onSignOut}
              className="p-2 rounded-full hover:bg-gray-700"
              title="Sign Out"
            >
              <LogOut className="h-5 w-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;