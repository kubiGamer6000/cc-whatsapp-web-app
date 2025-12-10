import React, { useRef, useEffect } from 'react';
import { WhatsAppMessage } from '../../types';
import MessageItem from './MessageItem';

interface ChatMessagesProps {
  messages: WhatsAppMessage[];
  loading: boolean;
  selectedChatName: string;
  audioPlayers: Record<string, HTMLAudioElement>;
  getMessageContent: (message: WhatsAppMessage) => string;
  getMediaUrl: (message: WhatsAppMessage) => Promise<string | null>;
  handleAudioPlay: (messageId: string) => void;
  setAudioRef: (messageId: string, element: HTMLAudioElement | null) => void;
  toggleDescription: (messageId: string) => void;
  formatDuration: (seconds: number) => string;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  loading,
  selectedChatName,
  audioPlayers,
  getMessageContent,
  getMediaUrl,
  handleAudioPlay,
  setAudioRef,
  toggleDescription,
  formatDuration
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && !loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <h2 className="text-lg font-semibold text-gray-200 truncate">
          {selectedChatName}
        </h2>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-400">Loading messages...</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">No messages in this chat</p>
            </div>
          ) : (
            messages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                getMessageContent={getMessageContent}
                getMediaUrl={getMediaUrl}
                handleAudioPlay={() => handleAudioPlay(message.key.id)}
                setAudioRef={(el) => setAudioRef(message.key.id, el)}
                isPlaying={!audioPlayers[message.key.id]?.paused}
                toggleDescription={toggleDescription}
                formatDuration={formatDuration}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default ChatMessages;