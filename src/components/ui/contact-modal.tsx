import React from 'react';
import { X, Users2, UserCircle } from 'lucide-react';
import { Chat } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  contact: Chat;
  isOpen: boolean;
  onClose: () => void;
  getContactDisplayName: (contact: Chat) => string;
}

const ContactModal: React.FC<ContactModalProps> = ({
  contact,
  isOpen,
  onClose,
  getContactDisplayName
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 md:p-8">
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl rounded-lg shadow-xl border border-white/10 flex flex-col max-h-[90vh] sm:max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              {/* Header - Fixed */}
              <div className="flex items-start justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {contact.isGroup ? (
                    <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
                      <Users2 className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="p-2 rounded-full bg-blue-500/10 text-blue-400">
                      <UserCircle className="h-6 w-6" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {getContactDisplayName(contact)}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {contact.isGroup ? 'Group' : 'Individual Contact'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              {/* Content - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {contact.knowledge?.shortDescription && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Summary</h3>
                      <p className="text-white break-words">
                        {contact.knowledge.shortDescription}
                      </p>
                    </div>
                  )}
                  
                  {contact.knowledge?.fullDescription && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Details</h3>
                      <div className="prose prose-invert max-w-none">
                        <p className="text-gray-300 whitespace-pre-wrap break-words">
                          {contact.knowledge.fullDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContactModal;