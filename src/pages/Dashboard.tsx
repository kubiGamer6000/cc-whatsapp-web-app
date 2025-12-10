import React, { useState, useEffect, useRef } from 'react';
import { collection, query, orderBy, limit, getDocs, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { LogEntry, LogStats } from '../types';
import { calculateStats } from '../utils';
import { Terminal } from 'lucide-react';

// Components
import LogList from '../components/LogList';
import StatsPanel from '../components/StatsPanel';
import FilterBar from '../components/FilterBar';

function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState<LogStats>({
    totalLogs: 0,
    byLevel: {},
    byMessageType: {},
    averageProcessingTime: 0,
    messageFlows: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState('');
  const [messageTypeFilter, setMessageTypeFilter] = useState('');
  const [liveUpdates, setLiveUpdates] = useState(true);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const setupLiveUpdates = () => {
    try {
      const logsRef = collection(db, 'logs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(100));
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedLogs: LogEntry[] = [];
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          
          let timestamp = data.timestamp;
          
          if (timestamp instanceof Timestamp) {
            timestamp = timestamp.toDate().toISOString();
          }
          
          fetchedLogs.push({ 
            id: doc.id, 
            ...data,
            timestamp 
          } as LogEntry);
        });
        
        fetchedLogs.sort((a, b) => {
          const dateA = typeof a.timestamp === 'string' 
            ? new Date(a.timestamp).getTime() 
            : a.timestamp.seconds * 1000 + a.timestamp.nanoseconds / 1000000;
            
          const dateB = typeof b.timestamp === 'string' 
            ? new Date(b.timestamp).getTime() 
            : b.timestamp.seconds * 1000 + b.timestamp.nanoseconds / 1000000;
            
          return dateB - dateA;
        });
        
        setLogs(fetchedLogs);
        setStats(calculateStats(fetchedLogs));
        setLoading(false);
      }, (err) => {
        console.error('Error in live updates:', err);
        setError('Failed to get live updates. Check your Firebase configuration.');
        setLoading(false);
      });
      
      unsubscribeRef.current = unsubscribe;
    } catch (err) {
      console.error('Error setting up live updates:', err);
      setError('Failed to set up live updates. Check your Firebase configuration.');
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const logsRef = collection(db, 'logs');
      const q = query(logsRef, orderBy('timestamp', 'desc'), limit(100));
      const querySnapshot = await getDocs(q);
      
      const fetchedLogs: LogEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        let timestamp = data.timestamp;
        
        if (timestamp instanceof Timestamp) {
          timestamp = timestamp.toDate().toISOString();
        }
        
        fetchedLogs.push({ 
          id: doc.id, 
          ...data,
          timestamp 
        } as LogEntry);
      });
      
      setLogs(fetchedLogs);
      setStats(calculateStats(fetchedLogs));
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to fetch logs. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (liveUpdates) {
      setupLiveUpdates();
    } else {
      fetchLogs();
    }
    
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [liveUpdates]);

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}

      <StatsPanel stats={stats} />
      
      <FilterBar
        levelFilter={levelFilter}
        setLevelFilter={setLevelFilter}
        messageTypeFilter={messageTypeFilter}
        setMessageTypeFilter={setMessageTypeFilter}
        onRefresh={() => {
          if (liveUpdates) {
            setupLiveUpdates();
          } else {
            fetchLogs();
          }
        }}
      />
      
      {loading ? (
        <div className="bg-black rounded-lg shadow p-8 text-center">
          <p className="text-gray-400">Loading logs...</p>
        </div>
      ) : (
        <LogList 
          logs={logs} 
          levelFilter={levelFilter} 
          messageTypeFilter={messageTypeFilter} 
        />
      )}
    </div>
  );
}

export default Dashboard;