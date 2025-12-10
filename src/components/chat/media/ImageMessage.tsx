import React, { useState, useEffect } from 'react';
import { WhatsAppMessage } from '../../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ImageMessageProps {
  message: WhatsAppMessage;
  getMediaUrl: (message: WhatsAppMessage) => Promise<string | null>;
  toggleDescription: (messageId: string) => void;
}

const ImageMessage: React.FC<ImageMessageProps> = ({ 
  message, 
  getMediaUrl, 
  toggleDescription 
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDescription, setShowDescription] = useState(false);
  const hasDescription = !!message.processResult;

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
    return <div className="animate-pulse bg-gray-700 h-64 w-full rounded"></div>;
  }

  if (!url) {
    return <div className="text-gray-300">Failed to load image</div>;
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <img
          src={url}
          alt={message.processResult || 'Image'}
          className="rounded-lg max-h-[400px] w-auto object-contain"
        />
      </div>
      
      {hasDescription && (
        <div className="mt-2">
          <button 
            onClick={() => setShowDescription(!showDescription)}
            className="flex items-center text-xs text-gray-400 hover:underline"
          >
            {showDescription ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Hide AI Description
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Show AI Description
              </>
            )}
          </button>
          
          {showDescription && (
            <div className="mt-2 p-2 rounded text-xs bg-gray-900/50">
              {message.processResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageMessage;