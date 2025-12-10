import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ProgressCardProps {
  progress: {
    projectName: string;
    progressSummary: string;
  };
  index: number;
  isExpanded: boolean;
  isVisible: boolean;
  textGenerationComplete: boolean;
  onToggle: (index: number) => void;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  progress,
  index,
  isExpanded,
  isVisible,
  textGenerationComplete,
  onToggle
}) => {
  return (
    <motion.div
      layout
      data-index={index}
      className="progress-item"
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : 20
      }}
      transition={{ 
        duration: 0.5,
        delay: textGenerationComplete ? index * 0.1 : 0
      }}
    >
      <motion.div
        layout
        className={`
          relative bg-gradient-to-br from-green-500/20 to-green-500/5 
          shadow-[inset_0_1px_0_0_rgba(34,197,94,0.1)]
          backdrop-blur-lg rounded-lg overflow-hidden
          transition-colors duration-200 group
          ${isExpanded ? 'shadow-lg' : ''}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <motion.div 
          layout
          className="p-4 cursor-pointer relative"
          onClick={() => onToggle(index)}
        >
          <div className="flex items-center justify-between">
            <motion.h3 
              layout
              className="text-white font-medium"
            >
              {progress.projectName}
            </motion.h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </motion.div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 text-gray-300"
              >
                {progress.progressSummary}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressCard;