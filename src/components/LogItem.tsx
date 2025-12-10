import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Bug, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { LogEntry } from '../types';
import { formatTimestamp, formatRelativeTime, getLevelColor, getMessageType } from '../utils';

interface LogItemProps {
  log: LogEntry;
}

const LogItem: React.FC<LogItemProps> = ({ log }) => {
  const [expanded, setExpanded] = useState(false);
  const [relativeTime, setRelativeTime] = useState('');
  const levelClass = getLevelColor(log.level);
  const messageType = getMessageType(log);

  // Update relative time every second
  useEffect(() => {
    // Initial update
    setRelativeTime(formatRelativeTime(log.timestamp));
    
    // Set up interval for live updates
    const intervalId = setInterval(() => {
      setRelativeTime(formatRelativeTime(log.timestamp));
    }, 1000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [log.timestamp]);

  // Get the appropriate icon based on log level
  const getLevelIcon = () => {
    switch (log.levelName) {
      case 'debug':
        return <Bug size={14} />;
      case 'info':
        return <Info size={14} />;
      case 'warn':
        return <AlertTriangle size={14} />;
      case 'error':
        return <AlertCircle size={14} />;
      default:
        return <Bug size={14} />;
    }
  };

  return (
    <div className="border-b border-gray-800 hover:bg-gray-900 transition-colors">
      <div 
        className="px-3 py-2 cursor-pointer flex items-start justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded ${levelClass} flex items-center gap-1`}>
              {getLevelIcon()}
              <span className="ml-1">{log.levelName}</span>
            </span>
            <span className="text-xs text-gray-500">
              {relativeTime}
            </span>
            {log.data?.messageId && (
              <span className="text-xs bg-purple-900 text-purple-200 px-2 py-0.5 rounded">
                ID: {log.data.messageId.substring(0, 8)}...
              </span>
            )}
            {messageType !== 'other' && (
              <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded">
                {messageType}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-200 font-medium">{log.message}</p>
          <p className="text-xs text-gray-500">{formatTimestamp(log.timestamp)}</p>
        </div>
        <div className="ml-2 flex-shrink-0 text-gray-500">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-3 py-2 bg-gray-900 text-xs border-t border-gray-800">
          <div className="mb-2">
            {log.data?.jid && (
              <div className="mb-1">
                <span className="font-semibold text-gray-400">Contact:</span>{' '}
                <span className="text-gray-300">{log.data.jid}</span>
                {log.data.pushName && <span className="text-gray-300"> ({log.data.pushName})</span>}
                {log.data.fromMe !== undefined && (
                  <span className="text-gray-300"> - {log.data.fromMe ? 'Sent' : 'Received'}</span>
                )}
              </div>
            )}
            {log.data?.duration && (
              <div className="mb-1">
                <span className="font-semibold text-gray-400">Duration:</span>{' '}
                <span className="text-gray-300">{log.data.duration}ms</span>
              </div>
            )}
            {log.data?.processingTime && (
              <div className="mb-1">
                <span className="font-semibold text-gray-400">Processing Time:</span>{' '}
                <span className="text-gray-300">{log.data.processingTime}ms</span>
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold mb-1 text-gray-400">Data:</p>
            <pre className="bg-gray-950 p-2 rounded overflow-x-auto text-green-400 border border-gray-800">
              {JSON.stringify(log.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogItem;