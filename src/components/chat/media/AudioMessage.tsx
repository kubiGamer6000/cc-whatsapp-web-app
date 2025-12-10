import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FileAudio, ChevronDown, ChevronUp } from 'lucide-react';
import { WhatsAppMessage } from '../../../types';

interface AudioMessageProps {
  message: WhatsAppMessage;
  getMediaUrl: (message: WhatsAppMessage) => Promise<string | null>;
  handleAudioPlay: () => void;
  setAudioRef: (element: HTMLAudioElement | null) => void;
  isPlaying: boolean;
  formatDuration: (seconds: number) => string;
}

const AudioMessage: React.FC<AudioMessageProps> = ({ 
  message, 
  getMediaUrl, 
  handleAudioPlay, 
  setAudioRef, 
  isPlaying, 
  formatDuration 
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranscription, setShowTranscription] = useState(false);
  const hasTranscription = !!message.processResult;
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Set audio ref only once when the component mounts
  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
    // We intentionally don't include setAudioRef in the dependency array
    // to prevent infinite updates
  }, [message.key.id]);

  useEffect(() => {
    const fetchUrl = async () => {
      setLoading(true);
      const mediaUrl = await getMediaUrl(message);
      setUrl(mediaUrl);
      setLoading(false);
    };

    fetchUrl();
  }, [message, getMediaUrl]);

  if (loading) {
    return <div className="animate-pulse bg-gray-700 h-12 w-full rounded"></div>;
  }

  if (!url) {
    return <div className="text-gray-300">Failed to load audio</div>;
  }

  // Safely access audio message seconds
  const seconds = message.message?.audioMessage?.seconds;
  const duration = typeof seconds === 'number' ? formatDuration(seconds) : '0:00';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 w-full">
        <audio
          src={url}
          ref={audioRef}
          className="hidden"
        />
        <button
          className="p-2 rounded-full hover:bg-black/20 transition-colors flex-shrink-0"
          onClick={handleAudioPlay}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-sm truncate">Voice Message</div>
          <div className="text-xs opacity-75">{duration}</div>
        </div>
        <FileAudio size={20} className="flex-shrink-0" />
      </div>
      
      {hasTranscription && (
        <div className="mt-2">
          <button 
            onClick={() => setShowTranscription(!showTranscription)}
            className="flex items-center text-xs text-gray-400 hover:underline"
          >
            {showTranscription ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Hide Transcription
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Show Transcription
              </>
            )}
          </button>
          
          {showTranscription && (
            <div className="mt-2 p-2 rounded text-xs bg-gray-900/50">
              {message.processResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AudioMessage;