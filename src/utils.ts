import { format, parseISO, formatDistanceToNow, formatRelative } from 'date-fns';
import { LogEntry, LogStats } from './types';

export const formatTimestamp = (timestamp: string | { seconds: number; nanoseconds: number }): string => {
  try {
    if (typeof timestamp === 'string') {
      return format(parseISO(timestamp), 'yyyy-MM-dd HH:mm:ss.SSS');
    } else if (timestamp && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
      // Handle Firestore Timestamp objects
      const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
      return format(date, 'yyyy-MM-dd HH:mm:ss.SSS');
    }
    return 'Invalid date';
  } catch (error) {
    console.error('Error formatting timestamp:', error, timestamp);
    return 'Invalid date';
  }
};

export const formatRelativeTime = (timestamp: string | { seconds: number; nanoseconds: number }): string => {
  try {
    let date: Date;
    
    if (typeof timestamp === 'string') {
      date = parseISO(timestamp);
    } else if (timestamp && 'seconds' in timestamp && 'nanoseconds' in timestamp) {
      // Handle Firestore Timestamp objects
      date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
    } else {
      return 'Invalid date';
    }
    
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  } catch (error) {
    console.error('Error calculating relative time:', error, timestamp);
    return 'Invalid date';
  }
};

export const getLevelColor = (level: number): string => {
  switch (level) {
    case 10: return 'bg-red-900 text-red-200';
    case 20: return 'bg-blue-900 text-blue-200';
    case 30: return 'bg-green-900 text-green-200';
    case 40: return 'bg-yellow-900 text-yellow-200';
    case 50: return 'bg-red-900 text-red-200';
    default: return 'bg-gray-800 text-gray-200';
  }
};

export const getMessageType = (log: LogEntry): string => {
  if (log.data?.messageType) return log.data.messageType;
  if (log.message.includes('audio')) return 'audio';
  if (log.message.includes('image')) return 'image';
  if (log.message.includes('text')) return 'text';
  if (log.data?.recv?.tag === 'receipt') return 'receipt';
  return 'other';
};

export const calculateStats = (logs: LogEntry[]): LogStats => {
  const stats: LogStats = {
    totalLogs: logs.length,
    byLevel: {},
    byMessageType: {},
    averageProcessingTime: 0,
    messageFlows: {}
  };

  let totalProcessingTime = 0;
  let processingTimeCount = 0;

  logs.forEach(log => {
    // Count by level
    stats.byLevel[log.levelName] = (stats.byLevel[log.levelName] || 0) + 1;
    
    // Count by message type
    const messageType = getMessageType(log);
    stats.byMessageType[messageType] = (stats.byMessageType[messageType] || 0) + 1;
    
    // Track message flows
    if (log.data?.messageId) {
      stats.messageFlows[log.data.messageId] = (stats.messageFlows[log.data.messageId] || 0) + 1;
    }
    
    // Calculate average processing time
    if (log.data?.duration) {
      totalProcessingTime += log.data.duration;
      processingTimeCount++;
    }
  });

  stats.averageProcessingTime = processingTimeCount > 0 
    ? Math.round(totalProcessingTime / processingTimeCount) 
    : 0;

  return stats;
};

export const extractJid = (jid: string): string => {
  if (!jid) return 'Unknown';
  return jid.split('@')[0];
};

export const formatMessageDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  const now = new Date();
  
  // Check if the message is from today
  if (date.toDateString() === now.toDateString()) {
    return format(date, 'h:mm a'); // Today: just show time
  }
  
  // Check if the message is from yesterday
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${format(date, 'h:mm a')}`;
  }
  
  // Check if the message is from this week
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff < 7) {
    return format(date, 'EEEE, h:mm a'); // Show day name and time
  }
  
  // For older messages, show the full date
  return format(date, 'MMM d, yyyy h:mm a');
};

export const getLastMessagePreview = (text: string, maxLength: number = 30): string => {
  if (!text) return '';
  
  // Remove any markdown or special formatting
  const cleanText = text.replace(/\*\*|__|\*|_|~~/g, '');
  
  if (cleanText.length <= maxLength) return cleanText;
  return `${cleanText.substring(0, maxLength)}...`;
};

export const formatTaskDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if it's today, tomorrow, or yesterday
  if (date.toDateString() === now.toDateString()) {
    return 'Today';
  }
  if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  // Check if it's within the next 7 days
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays > 0 && diffDays <= 7) {
    return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
  }

  // Otherwise return date without year
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

export const getUrgencyLabel = (urgency: number): string => {
  switch (urgency) {
    case 1: return 'Low';
    case 2: return 'Medium-Low';
    case 3: return 'Medium';
    case 4: return 'High';
    case 5: return 'Critical';
    default: return 'Unknown';
  }
};

export const getUrgencyColor = (urgency: number): string => {
  switch (urgency) {
    case 1: return 'bg-blue-900/30 text-blue-300 border-blue-500/30';
    case 2: return 'bg-green-900/30 text-green-300 border-green-500/30';
    case 3: return 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30';
    case 4: return 'bg-orange-900/30 text-orange-300 border-orange-500/30';
    case 5: return 'bg-red-900/30 text-red-300 border-red-500/30';
    default: return 'bg-gray-900/30 text-gray-300 border-gray-500/30';
  }
};