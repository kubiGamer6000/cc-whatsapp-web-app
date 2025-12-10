import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Chat } from '../types';
import { Users, ChevronDown, UserCircle, Users2, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactModal from '@/components/ui/contact-modal';
import Loading from '@/components/ui/loading';
import PageHeader from '@/components/ui/page-header';

const MAX_PREVIEW_WORDS = 30;

const ContactsPage = () => {
  const [contacts, setContacts] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedContact, setSelectedContact] = useState<Chat | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const contactsRef = collection(db, 'chats_ace');
    const q = query(contactsRef, orderBy('lastActivityTimestamp', 'desc'));

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const fetchedContacts: Chat[] = [];
        snapshot.forEach((doc) => {
          fetchedContacts.push({ id: doc.id, ...doc.data() } as Chat);
        });
        setContacts(fetchedContacts);
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching contacts:', err);
        setError('Failed to fetch contacts. Please try again.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const getContactDisplayName = (contact: Chat): string => {
    if (contact.name) return contact.name;
    const phoneNumber = contact.id.split('@')[0];
    return phoneNumber;
  };

  const truncateDescription = (text: string): string => {
    const words = text.split(/\s+/);
    if (words.length <= MAX_PREVIEW_WORDS) return text;
    return words.slice(0, MAX_PREVIEW_WORDS).join(' ') + '...';
  };

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase().trim();
    return contacts.filter(contact => {
      const name = getContactDisplayName(contact).toLowerCase();
      const description = contact.knowledge?.shortDescription?.toLowerCase() || '';
      return name.includes(query) || description.includes(query);
    });
  }, [contacts, searchQuery]);

  const contactsWithKnowledge = filteredContacts.filter(contact => contact.knowledge?.shortDescription);
  const contactsWithoutKnowledge = filteredContacts.filter(contact => !contact.knowledge?.shortDescription);

  interface ContactCardProps {
    contact: Chat;
  }

  const ContactCard = forwardRef<HTMLDivElement, ContactCardProps>(({ contact }, ref) => (
    <div
      ref={ref}
      onClick={() => setSelectedContact(contact)}
      className={`
        relative border border-white/10 rounded-lg overflow-hidden h-full cursor-pointer 
        hover:border-white/20 transition-all group backdrop-blur-lg
        ${contact.isGroup 
          ? 'bg-gradient-to-br from-purple-500/20 to-purple-500/5 shadow-[inset_0_1px_0_0_rgba(168,85,247,0.1)]'
          : 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 shadow-[inset_0_1px_0_0_rgba(59,130,246,0.1)]'
        }
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative p-4 flex flex-col h-full z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {contact.isGroup ? (
              <div className="p-2 rounded-full bg-purple-500/10 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                <Users2 className="h-6 w-6" />
              </div>
            ) : (
              <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <UserCircle className="h-6 w-6" />
              </div>
            )}
            <div>
              <h3 className="font-medium text-white">
                {getContactDisplayName(contact)}
              </h3>
              <span className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                {contact.isGroup ? 'Group' : 'Individual Contact'}
              </span>
            </div>
          </div>
        </div>

        {contact.knowledge?.shortDescription ? (
          <div className="flex-1 flex flex-col">
            <p className="text-sm text-gray-300 group-hover:text-gray-200 transition-colors flex-1">
              {truncateDescription(contact.knowledge.shortDescription)}
            </p>
            {contact.knowledge.fullDescription && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <button
                  className="flex items-center text-xs text-gray-400 group-hover:text-gray-300 transition-colors"
                >
                  <ChevronDown size={14} className="mr-1" />
                  View Details
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
              No additional information
            </p>
          </div>
        )}
      </div>
    </div>
  ));

  ContactCard.displayName = 'ContactCard';

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center">
        <Loading message="Loading contacts" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-10rem)]">
      <PageHeader icon={Users} title="Contacts" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className={`
            relative flex items-center transition-all duration-200
            ${isSearchFocused 
              ? 'bg-black/40 backdrop-blur-xl shadow-lg' 
              : 'bg-black/20 backdrop-blur-lg'
            }
            border border-white/10 rounded-lg overflow-hidden
            ${isSearchFocused ? 'ring-2 ring-white/20' : 'hover:bg-black/30'}
          `}>
            <Search className={`
              h-5 w-5 ml-4 transition-colors duration-200
              ${isSearchFocused ? 'text-white' : 'text-gray-400'}
            `} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholder="Search contacts..."
              className="w-full bg-transparent px-4 py-3 text-white placeholder-gray-400 focus:outline-none"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => setSearchQuery('')}
                  className="p-2 mr-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
          </div>
        )}

        {filteredContacts.length === 0 ? (
          <div className="backdrop-blur-md rounded-lg border border-white/10 p-12 text-center mt-6">
            {searchQuery ? (
              <p className="text-gray-400 text-lg">No contacts found matching "{searchQuery}"</p>
            ) : (
              <p className="text-gray-400 text-lg">No contacts found</p>
            )}
          </div>
        ) : (
          <div className="space-y-8 mt-6">
            {/* Contacts with Details */}
            {contactsWithKnowledge.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Contacts with Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {contactsWithKnowledge.map(contact => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ContactCard contact={contact} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Other Contacts */}
            {contactsWithoutKnowledge.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-white">Other Contacts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {contactsWithoutKnowledge.map(contact => (
                    <motion.div
                      key={contact.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ContactCard contact={contact} />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedContact && (
          <ContactModal
            contact={selectedContact}
            isOpen={true}
            onClose={() => setSelectedContact(null)}
            getContactDisplayName={getContactDisplayName}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContactsPage;