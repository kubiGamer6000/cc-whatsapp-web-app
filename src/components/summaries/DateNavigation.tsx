import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

interface DateNavigationProps {
  currentDate: Date;
  hasPreviousDay: boolean;
  hasNextDay: boolean;
  onPreviousDay: () => void;
  onNextDay: () => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  currentDate,
  hasPreviousDay,
  hasNextDay,
  onPreviousDay,
  onNextDay
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPreviousDay}
        className={`p-2 rounded-lg border ${
          hasPreviousDay
            ? 'border-white/10 hover:border-white/20 bg-white/5'
            : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
        }`}
        disabled={!hasPreviousDay}
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </motion.button>

      <motion.div 
        layout
        className="text-center px-4"
      >
        <motion.p 
          layout
          className="text-sm text-gray-400 mb-1"
        >
          {format(currentDate, 'MMMM d, yyyy')}
        </motion.p>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onNextDay}
        className={`p-2 rounded-lg border ${
          hasNextDay
            ? 'border-white/10 hover:border-white/20 bg-white/5'
            : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
        }`}
        disabled={!hasNextDay}
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </motion.button>
    </div>
  );
};

export default DateNavigation;