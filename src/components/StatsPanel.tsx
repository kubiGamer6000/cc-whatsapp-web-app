import React from 'react';
import { LogStats } from '../types';
import { Clock, MessageSquare, AlertCircle, BarChart2, Bug, Info, AlertTriangle } from 'lucide-react';

interface StatsPanelProps {
  stats: LogStats;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const { totalLogs, byLevel, byMessageType, averageProcessingTime, messageFlows } = stats;
  
  const activeFlows = Object.keys(messageFlows).length;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-900 text-blue-200 mr-4">
            <MessageSquare size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Total Logs</p>
            <p className="text-xl font-semibold text-gray-200">{totalLogs}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-900 text-green-200 mr-4">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Avg. Processing Time</p>
            <p className="text-xl font-semibold text-gray-200">{averageProcessingTime} ms</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-900 text-purple-200 mr-4">
            <BarChart2 size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Message Flows</p>
            <p className="text-xl font-semibold text-gray-200">{activeFlows}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg shadow-md border border-gray-700 p-4">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-900 text-blue-200 mr-4">
            <Bug size={20} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-400">Debug Logs</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-semibold text-gray-200">{byLevel['debug'] || 0}</p>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <div className="flex items-center"><Info size={12} className="text-green-400 mr-1" />{byLevel['info'] || 0}</div>
                <div className="flex items-center"><AlertTriangle size={12} className="text-yellow-400 mr-1" />{byLevel['warn'] || 0}</div>
                <div className="flex items-center"><AlertCircle size={12} className="text-red-400 mr-1" />{byLevel['error'] || 0}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;