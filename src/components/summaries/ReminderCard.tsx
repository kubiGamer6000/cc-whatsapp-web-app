import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Bell, Trash2, ChevronDown } from 'lucide-react';
import ReminderActionButton from './ReminderActionButton';

// WhatsApp icon component
const WhatsAppIcon = () => (
  <svg 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className="w-5 h-5"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

interface ReminderCardProps {
  reminder: {
    reminderTitle: string;
    reminderDetails: string;
  };
  index: number;
  isExpanded: boolean;
  isVisible: boolean;
  textGenerationComplete: boolean;
  onToggle: (index: number) => void;
  onAction: (action: string) => void;
}

const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  index,
  isExpanded,
  isVisible,
  textGenerationComplete,
  onToggle,
  onAction
}) => {
  return (
    <motion.div
      layout
      data-index={index}
      className="reminder-item"
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
          relative bg-gradient-to-br from-blue-500/20 to-blue-500/5 
          shadow-[inset_0_1px_0_0_rgba(59,130,246,0.1)]
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
              {reminder.reminderTitle}
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
                className="mt-3 space-y-3"
              >
                <p className="text-gray-300">
                  {reminder.reminderDetails}
                </p>
                
                <div className="grid grid-cols-4 gap-2 pt-4">
                  <ReminderActionButton
                    icon={Calendar}
                    onClick={() => onAction('calendar')}
                    colorClass="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 w-full h-12"
                  />
                  <ReminderActionButton
                    icon={WhatsAppIcon}
                    onClick={() => onAction('whatsapp')}
                    colorClass="bg-green-500/10 text-green-400 hover:bg-green-500/20 w-full h-12"
                  />
                  <ReminderActionButton
                    icon={Bell}
                    onClick={() => onAction('notification')}
                    colorClass="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 w-full h-12"
                  />
                  <ReminderActionButton
                    icon={Trash2}
                    onClick={() => onAction('delete')}
                    colorClass="bg-red-500/10 text-red-400 hover:bg-red-500/20 w-full h-12"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ReminderCard;