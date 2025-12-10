import React, { useState } from 'react';
import { WhatsAppMessage } from '../../types';
import ImageMessage from './media/ImageMessage';
import AudioMessage from './media/AudioMessage';
import DocumentMessage from './media/DocumentMessage';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatMessageDate } from '../../utils';

interface MessageItemProps {
  message: WhatsAppMessage;
  getMessageContent: (message: WhatsAppMessage) => string;
  getMediaUrl: (message: WhatsAppMessage) => Promise<string | null>;
  handleAudioPlay: () => void;
  setAudioRef: (element: HTMLAudioElement | null) => void;
  isPlaying: boolean;
  toggleDescription: (messageId: string) => void;
  formatDuration: (seconds: number) => string;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  getMessageContent,
  getMediaUrl,
  handleAudioPlay,
  setAudioRef,
  isPlaying,
  toggleDescription,
  formatDuration
}) => {
  const [showProcessResult, setShowProcessResult] = useState(false);
  const hasProcessResult = !!message.processResult && !message.isMedia;
  
  return (
    <div className={`flex ${message.key.fromMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] md:max-w-[65%] rounded-lg shadow-md p-3 overflow-hidden ${
          message.key.fromMe
            ? 'bg-blue-800 text-blue-100'
            : 'bg-gray-800 text-gray-200'
        }`}
      >
        <div
          className={`text-sm mb-1 ${
            message.key.fromMe ? 'text-blue-300' : 'text-gray-400'
          }`}
        >
          {message.key.fromMe ? 'Ace' : message.pushName || 'Unknown'}
        </div>
        
        <div className="break-words overflow-hidden">
          {message.isMedia ? (
            message.messageType === 'imageMessage' ? (
              <React.Suspense fallback={
                <div className="animate-pulse bg-gray-700 h-64 w-full rounded"></div>
              }>
                <ImageMessage 
                  message={message} 
                  getMediaUrl={getMediaUrl} 
                  toggleDescription={toggleDescription} 
                />
              </React.Suspense>
            ) : message.messageType === 'audioMessage' ? (
              <React.Suspense fallback={
                <div className="animate-pulse bg-gray-700 h-12 w-full rounded"></div>
              }>
                <AudioMessage 
                  message={message} 
                  getMediaUrl={getMediaUrl} 
                  handleAudioPlay={handleAudioPlay} 
                  setAudioRef={setAudioRef}
                  isPlaying={isPlaying}
                  formatDuration={formatDuration}
                />
              </React.Suspense>
            ) : message.messageType === 'documentMessage' ? (
              <React.Suspense fallback={
                <div className="animate-pulse bg-gray-700 h-16 w-full rounded"></div>
              }>
                <DocumentMessage 
                  message={message} 
                  getMediaUrl={getMediaUrl} 
                />
              </React.Suspense>
            ) : (
              <div className="text-gray-300">[Unsupported media type]</div>
            )
          ) : (
            <div className="text-sm whitespace-pre-wrap break-words">{getMessageContent(message)}</div>
          )}
          
          {/* Process result for non-media messages */}
          {hasProcessResult && (
            <div className="mt-2">
              <button 
                onClick={() => setShowProcessResult(!showProcessResult)}
                className={`flex items-center text-xs ${
                  message.key.fromMe ? 'text-blue-300' : 'text-gray-400'
                } hover:underline`}
              >
                {showProcessResult ? (
                  <>
                    <ChevronUp size={14} className="mr-1" />
                    Hide AI Analysis
                  </>
                ) : (
                  <>
                    <ChevronDown size={14} className="mr-1" />
                    Show AI Analysis
                  </>
                )}
              </button>
              
              {showProcessResult && (
                <div className={`mt-2 p-2 rounded text-xs ${
                  message.key.fromMe ? 'bg-blue-900/50' : 'bg-gray-900/50'
                }`}>
                  {message.processResult}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div
          className={`text-xs text-right mt-1 ${
            message.key.fromMe ? 'text-blue-300' : 'text-gray-400'
          }`}
        >
          {formatMessageDate(message.messageTimestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;