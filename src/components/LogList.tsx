import React from 'react';
import { LogEntry } from '../types';
import LogItem from './LogItem';
import { getMessageType } from '../utils';

interface LogListProps {
  logs: LogEntry[];
  levelFilter: string;
  messageTypeFilter: string;
}

const LogList: React.FC<LogListProps> = ({ logs, levelFilter, messageTypeFilter }) => {
  // Filter logs based on selected filters
  const filteredLogs = logs.filter(log => {
    if (levelFilter && log.levelName !== levelFilter) return false;
    if (messageTypeFilter) {
      const type = getMessageType(log);
      if (type !== messageTypeFilter) return false;
    }
    return true;
  });

  if (filteredLogs.length === 0) {
    return (
      <div className="bg-black rounded-lg shadow p-8 text-center">
        <p className="text-gray-400">No logs match your filters</p>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-lg shadow overflow-hidden text-gray-200 font-mono">
      <div className="p-2 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <span className="text-xs text-gray-400">Terminal Output</span>
        <span className="text-xs text-gray-400">{filteredLogs.length} entries</span>
      </div>
      <div className="p-2 max-h-[70vh] overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        {filteredLogs.map(log => (
          <LogItem key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
};

export default LogList;