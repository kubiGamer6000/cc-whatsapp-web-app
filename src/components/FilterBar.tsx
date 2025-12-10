import React from 'react';
import { Filter, RefreshCw, Bug, Info, AlertTriangle, AlertCircle } from 'lucide-react';

interface FilterBarProps {
  levelFilter: string;
  setLevelFilter: (level: string) => void;
  messageTypeFilter: string;
  setMessageTypeFilter: (type: string) => void;
  onRefresh: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  levelFilter,
  setLevelFilter,
  messageTypeFilter,
  setMessageTypeFilter,
  onRefresh
}) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center">
          <Filter size={16} className="text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-300 mr-2">Filters:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <select
              className="text-sm bg-gray-900 border border-gray-700 text-gray-300 rounded-md pl-8 pr-3 py-2 appearance-none"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warn">Warn</option>
              <option value="error">Error</option>
            </select>
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
              {levelFilter === 'debug' && <Bug size={16} />}
              {levelFilter === 'info' && <Info size={16} />}
              {levelFilter === 'warn' && <AlertTriangle size={16} />}
              {levelFilter === 'error' && <AlertCircle size={16} />}
              {!levelFilter && <Bug size={16} />}
            </div>
          </div>
          
          <select
            className="text-sm bg-gray-900 border border-gray-700 text-gray-300 rounded-md px-3 py-2"
            value={messageTypeFilter}
            onChange={(e) => setMessageTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="audio">Audio</option>
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option value="receipt">Receipt</option>
            <option value="other">Other</option>
          </select>
          
          <button
            className="flex items-center text-sm bg-blue-900 text-blue-200 px-3 py-2 rounded-md hover:bg-blue-800"
            onClick={onRefresh}
          >
            <RefreshCw size={16} className="mr-1" />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;