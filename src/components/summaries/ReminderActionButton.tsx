import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Bell, Trash2 } from 'lucide-react';

interface ReminderActionButtonProps {
  icon: typeof Calendar | typeof Bell | typeof Trash2 | React.FC;
  onClick: () => void;
  colorClass: string;
}

const ReminderActionButton: React.FC<ReminderActionButtonProps> = ({ 
  icon: Icon, 
  onClick, 
  colorClass 
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`
      flex items-center justify-center rounded-lg backdrop-blur-sm
      ${colorClass}
      transition-colors duration-200
    `}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
  >
    {typeof Icon === 'function' ? <Icon /> : <Icon className="w-6 h-6" />}
  </motion.button>
);

export default ReminderActionButton;