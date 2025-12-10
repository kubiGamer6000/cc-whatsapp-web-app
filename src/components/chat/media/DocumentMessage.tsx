import React, { useState, useEffect } from 'react';
import { FileText, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { WhatsAppMessage } from '../../../types';

interface DocumentMessageProps {
  message: WhatsAppMessage;
  getMediaUrl: (message: WhatsAppMessage) => Promise<string | null>;
}

const DocumentMessage: React.FC<DocumentMessageProps> = ({ 
  message, 
  getMediaUrl 
}) => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const hasContent = !!message.processResult;

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
    return <div className="animate-pulse bg-gray-700 h-16 w-full rounded"></div>;
  }

  if (!url) {
    return <div className="text-gray-300">Failed to load document</div>;
  }

  // Safely get the file name
  const fileName = typeof message.message?.documentMessage?.fileName === 'string' 
    ? message.message.documentMessage.fileName 
    : 'Document';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 bg-black/20 rounded-lg p-3 w-full">
        <FileText size={24} className="flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {fileName}
          </div>
        </div>
        <a
          href={url}
          download={fileName}
          className="p-2 hover:bg-black/20 rounded-full transition-colors flex-shrink-0"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Download size={20} />
        </a>
      </div>
      
      {hasContent && (
        <div className="mt-2">
          <button 
            onClick={() => setShowContent(!showContent)}
            className="flex items-center text-xs text-gray-400 hover:underline"
          >
            {showContent ? (
              <>
                <ChevronUp size={14} className="mr-1" />
                Hide Content
              </>
            ) : (
              <>
                <ChevronDown size={14} className="mr-1" />
                Show Content
              </>
            )}
          </button>
          
          {showContent && (
            <div className="mt-2 p-2 rounded text-xs bg-gray-900/50">
              {message.processResult}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentMessage;