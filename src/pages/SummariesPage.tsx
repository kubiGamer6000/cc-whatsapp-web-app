import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';
import { db } from '../firebase';
import { BarChart2, CheckCircle2, Bell } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays, addDays, isToday, isYesterday, differenceInDays } from 'date-fns';
import PageHeader from '@/components/ui/page-header';
import Loading from '@/components/ui/loading';
import { Summary } from '@/types';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import DateNavigation from '@/components/summaries/DateNavigation';
import ReminderCard from '@/components/summaries/ReminderCard';
import ProgressCard from '@/components/summaries/ProgressCard';
import MarkdownContent from '@/components/summaries/MarkdownContent';
import VoiceFeedback from '@/components/summaries/VoiceFeedback';

const SummariesPage = () => {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPreviousDay, setHasPreviousDay] = useState(true);
  const [hasNextDay, setHasNextDay] = useState(false);
  const [textGenerationComplete, setTextGenerationComplete] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const [expandedReminders, setExpandedReminders] = useState<Set<number>>(new Set());
  const [visibleReminders, setVisibleReminders] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchLatestSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const summariesRef = collection(db, 'summaries');
        const q = query(
          summariesRef,
          orderBy('date', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          setSummary(null);
          setCurrentDate(new Date());
          return;
        }

        const summaryData = snapshot.docs[0].data() as Summary;
        setSummary({ id: snapshot.docs[0].id, ...summaryData });
        setCurrentDate(summaryData.date.toDate());
        setHasNextDay(false);
        
        const prevDayQuery = query(
          summariesRef,
          where('date', '<', summaryData.date),
          orderBy('date', 'desc'),
          limit(1)
        );
        
        const prevSnapshot = await getDocs(prevDayQuery);
        setHasPreviousDay(!prevSnapshot.empty);

      } catch (err) {
        console.error('Error fetching latest summary:', err);
        setError('Failed to fetch summary. Please try again.');
        setCurrentDate(new Date());
      } finally {
        setLoading(false);
      }
    };

    fetchLatestSummary();
  }, []);

  const fetchSummary = async (date: Date) => {
    if (!date) return;
    
    setLoading(true);
    setError(null);
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const summariesRef = collection(db, 'summaries');
      const q = query(
        summariesRef,
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
        limit(1)
      );

      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        setSummary(null);
        return;
      }

      const summaryData = snapshot.docs[0].data() as Summary;
      setSummary({ id: snapshot.docs[0].id, ...summaryData });

      const prevDayQuery = query(
        summariesRef,
        where('date', '<', startOfDay),
        orderBy('date', 'desc'),
        limit(1)
      );
      const nextDayQuery = query(
        summariesRef,
        where('date', '>', endOfDay),
        orderBy('date', 'asc'),
        limit(1)
      );

      const [prevSnapshot, nextSnapshot] = await Promise.all([
        getDocs(prevDayQuery),
        getDocs(nextDayQuery)
      ]);

      setHasPreviousDay(!prevSnapshot.empty);
      setHasNextDay(!nextSnapshot.empty);

    } catch (err) {
      console.error('Error fetching summary:', err);
      setError('Failed to fetch summary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentDate) {
      fetchSummary(currentDate);
    }
  }, [currentDate]);

  useEffect(() => {
    if (!summary || !textGenerationComplete) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(index)) {
              if (entry.target.classList.contains('reminder-item')) {
                setVisibleReminders(prev => new Set([...prev, index]));
              } else if (entry.target.classList.contains('progress-item')) {
                setVisibleItems(prev => new Set([...prev, index]));
              }
            }
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    document.querySelectorAll('.progress-item, .reminder-item').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [summary, textGenerationComplete]);

  const handlePreviousDay = () => {
    if (!hasPreviousDay || !currentDate) return;
    setCurrentDate(prev => prev ? subDays(prev, 1) : null);
  };

  const handleNextDay = () => {
    if (!hasNextDay || !currentDate) return;
    setCurrentDate(prev => prev ? addDays(prev, 1) : null);
  };

  const getDateHeading = (date: Date): string => {
    if (isToday(date)) return 'Today, summarized';
    if (isYesterday(date)) return 'Yesterday, summarized';
    
    const daysAgo = differenceInDays(new Date(), date);
    if (daysAgo < 7) return `Last ${format(date, 'EEEE')}, summarized`;
    return format(date, 'MMMM d, yyyy');
  };

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const toggleReminder = (index: number) => {
    setExpandedReminders(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const handleReminderAction = (action: string) => {
    console.log('Reminder action:', action);
    // Implement action handling
  };

  return (
    <div className="relative min-h-[calc(100vh-10rem)]">
      <PageHeader icon={BarChart2} title="Summaries" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {currentDate && (
          <DateNavigation
            currentDate={currentDate}
            hasPreviousDay={hasPreviousDay}
            hasNextDay={hasNextDay}
            onPreviousDay={handlePreviousDay}
            onNextDay={handleNextDay}
          />
        )}

        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <Loading />
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/50 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg"
          >
            <p>{error}</p>
          </motion.div>
        ) : !summary ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-[400px] flex items-center justify-center"
          >
            <div className="text-center">
              <p className="text-gray-400 text-lg">No summary available for this date</p>
              {hasPreviousDay && (
                <button
                  onClick={handlePreviousDay}
                  className="mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View previous day
                </button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-12"
          >
            <motion.div layout>
              <motion.h1 
                layout
                className="text-2xl md:text-3xl font-bold text-white mb-6"
              >
                {getDateHeading(currentDate!)}
              </motion.h1>

              <div className="max-w-3xl">
                <TextGenerateEffect 
                  words={summary.summary.briefWalkthroughOfTheDay}
                  className="!font-normal text-gray-300 leading-relaxed"
                  duration={1}
                  filter={true}
                  onComplete={() => setTextGenerationComplete(true)}
                />
              </div>
            </motion.div>

            {summary.summary.keyReminders.length > 0 && (
              <motion.div layout className="space-y-4">
                <motion.div 
                  layout
                  className="flex items-center gap-3"
                >
                  <motion.h2 
                    layout
                    className="text-xl font-semibold text-white"
                  >
                    Reminders
                  </motion.h2>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center"
                  >
                    <Bell className="w-5 h-5 text-blue-400" />
                  </motion.div>
                </motion.div>

                <div className="grid gap-3">
                  {summary.summary.keyReminders.map((reminder, index) => (
                    <ReminderCard
                      key={`reminder-${index}`}
                      reminder={reminder}
                      index={index}
                      isExpanded={expandedReminders.has(index)}
                      isVisible={visibleReminders.has(index)}
                      textGenerationComplete={true}
                      onToggle={toggleReminder}
                      onAction={handleReminderAction}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {summary.summary.fullSummary && (
              <motion.div layout className="space-y-4">
                <motion.div 
                  layout
                  className="max-w-4xl"
                >
                  <MarkdownContent content={summary.summary.fullSummary} />
                </motion.div>
              </motion.div>
            )}

            <motion.div layout className="space-y-4">
              <motion.div 
                layout
                className="flex items-center gap-3"
              >
                <motion.h2 
                  layout
                  className="text-xl font-semibold text-white"
                >
                  Today's accomplishments
                </motion.h2>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                  }}
                  className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                </motion.div>
              </motion.div>

              <div className="grid gap-3">
                {summary.summary.keyProgressMade.map((progress, index) => (
                  <ProgressCard
                    key={index}
                    progress={progress}
                    index={index}
                    isExpanded={expandedItems.has(index)}
                    isVisible={visibleItems.has(index)}
                    textGenerationComplete={textGenerationComplete}
                    onToggle={toggleExpanded}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
        {summary && <VoiceFeedback summaryId={summary.id} />}
      </div>
    </div>
  );
};

export default SummariesPage;