import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, where, onSnapshot, getDocs, limit } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { db, storage } from '../firebase';
import { Chat, WhatsAppMessage } from '../types';
import mime from 'mime-types';
import { getLastMessagePreview } from '../utils';

// Components
import ChatTabs from '../components/chat/ChatTabs';
import ChatMessages from '../components/chat/ChatMessages';

const MessagesPage: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioPlayers, setAudioPlayers] = useState<Record<string, HTMLAudioElement>>({});
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showChatList, setShowChatList] = useState(true);
  
  const unsubscribeChatsRef = useRef<(() => void) | null>(null);
  const unsubscribeMessagesRef = useRef<(() => void) | null>(null);
  const isUpdatingChatRef = useRef(false);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (!mobile) {
        setShowChatList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch last message for each chat
  const fetchLastMessages = async (chatsList: Chat[]) => {
    try {
      const updatedChats = await Promise.all(
        chatsList.map(async (chat) => {
          const messagesRef = collection(db, 'messages_ace');
          const q = query(
            messagesRef,
            where('chatId', '==', chat.id),
            orderBy('messageTimestamp', 'desc'),
            limit(1)
          );
          
          const snapshot = await getDocs(q);
          
          if (!snapshot.empty) {
            const lastMessageData = snapshot.docs[0].data();
            let messageText = '';
            
            // Extract text from different message types
            if (lastMessageData.isMedia) {
              if (lastMessageData.processResult) {
                messageText = lastMessageData.processResult;
              } else {
                messageText = `[${lastMessageData.messageType.replace('Message', '')}]`;
              }
            } else if (lastMessageData.message?.conversation) {
              messageText = lastMessageData.message.conversation;
            } else if (lastMessageData.message?.extendedTextMessage?.text) {
              messageText = lastMessageData.message.extendedTextMessage.text;
            }
            
            return {
              ...chat,
              lastMessage: {
                text: getLastMessagePreview(messageText),
                timestamp: lastMessageData.messageTimestamp
              }
            };
          }
          
          return chat;
        })
      );
      
      return updatedChats;
    } catch (err) {
      console.error('Error fetching last messages:', err);
      return chatsList;
    }
  };

  // Fetch chats
  useEffect(() => {
    setLoading(true);
    
    try {
      const chatsRef = collection(db, 'chats_ace');
      
      const unsubscribe = onSnapshot(chatsRef, async (snapshot) => {
        const fetchedChats: Chat[] = [];
        snapshot.forEach((doc) => {
          // Process each document to ensure all fields are properly formatted
          const data = doc.data();
          fetchedChats.push({ 
            id: doc.id, 
            name: typeof data.name === 'string' ? data.name : '',
            isGroup: !!data.isGroup
          });
        });
        
        // Fetch last message for each chat
        const chatsWithLastMessages = await fetchLastMessages(fetchedChats);
        setChats(chatsWithLastMessages);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching chats:', err);
        setError('Failed to fetch chats. Please check your Firebase configuration.');
        setLoading(false);
      });
      
      unsubscribeChatsRef.current = unsubscribe;
    } catch (err) {
      console.error('Error setting up chats listener:', err);
      setError('Failed to set up chats listener. Please check your Firebase configuration.');
      setLoading(false);
    }
    
    return () => {
      if (unsubscribeChatsRef.current) {
        unsubscribeChatsRef.current();
      }
    };
  }, []);

  // Fetch messages for selected chat
  useEffect(() => {
    if (selectedChat) {
      setMessagesLoading(true);
      
      try {
        const messagesRef = collection(db, 'messages_ace');
        const q = query(
          messagesRef,
          where('chatId', '==', selectedChat.id),
          orderBy('messageTimestamp', 'asc')
        );
        
        // Unsubscribe from previous listener if exists
        if (unsubscribeMessagesRef.current) {
          unsubscribeMessagesRef.current();
        }
        
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedMessages: WhatsAppMessage[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            
            // Ensure all required fields exist and are of the correct type
            const message: WhatsAppMessage = {
              id: doc.id,
              chatId: typeof data.chatId === 'string' ? data.chatId : '',
              messageTimestamp: typeof data.messageTimestamp === 'number' ? data.messageTimestamp : 0,
              key: {
                id: data.key?.id || '',
                fromMe: !!data.key?.fromMe,
                remoteJid: data.key?.remoteJid || ''
              },
              pushName: typeof data.pushName === 'string' ? data.pushName : 'Unknown',
              message: data.message || {},
              isMedia: !!data.isMedia,
              messageType: typeof data.messageType === 'string' ? data.messageType : 'unknown',
              processResult: typeof data.processResult === 'string' ? data.processResult : '',
              showDescription: false
            };
            
            fetchedMessages.push(message);
          });
          
          setMessages(fetchedMessages);
          setMessagesLoading(false);
          
          // Update the last message for this chat, but only if we're not already updating
          if (fetchedMessages.length > 0 && !isUpdatingChatRef.current) {
            isUpdatingChatRef.current = true;
            
            const lastMsg = fetchedMessages[fetchedMessages.length - 1];
            let messageText = '';
            
            // Extract text from different message types
            if (lastMsg.isMedia) {
              if (lastMsg.processResult) {
                messageText = lastMsg.processResult;
              } else {
                messageText = `[${lastMsg.messageType.replace('Message', '')}]`;
              }
            } else if (lastMsg.message?.conversation) {
              messageText = lastMsg.message.conversation;
            } else if (lastMsg.message?.extendedTextMessage?.text) {
              messageText = lastMsg.message.extendedTextMessage.text;
            }
            
            // Create the updated chat object
            const updatedChat = {
              ...selectedChat,
              lastMessage: {
                text: getLastMessagePreview(messageText),
                timestamp: lastMsg.messageTimestamp
              }
            };
            
            // Update the selected chat
            setSelectedChat(updatedChat);
            
            // Also update this chat in the chats list
            setChats(prevChats => 
              prevChats.map(chat => 
                chat.id === selectedChat.id ? updatedChat : chat
              )
            );
            
            // Reset the updating flag
            setTimeout(() => {
              isUpdatingChatRef.current = false;
            }, 100);
          }
        }, (err) => {
          console.error('Error fetching messages:', err);
          setError('Failed to fetch messages. Please check your Firebase configuration.');
          setMessagesLoading(false);
        });
        
        unsubscribeMessagesRef.current = unsubscribe;
        
        // On mobile, hide chat list when a chat is selected
        if (isMobileView) {
          setShowChatList(false);
        }
      } catch (err) {
        console.error('Error setting up messages listener:', err);
        setError('Failed to set up messages listener. Please check your Firebase configuration.');
        setMessagesLoading(false);
      }
    }
    
    return () => {
      if (unsubscribeMessagesRef.current) {
        unsubscribeMessagesRef.current();
      }
    };
  }, [selectedChat?.id, isMobileView]);

  const getMessageContent = (message: WhatsAppMessage): string => {
    if (message.isMedia) {
      return message.processResult || '';
    }
    
    if (message.message?.conversation) {
      return message.message.conversation;
    }
    
    if (message.message?.extendedTextMessage?.text) {
      return message.message.extendedTextMessage.text;
    }
    
    return JSON.stringify(message);
  };

  const getMediaUrl = async (message: WhatsAppMessage): Promise<string | null> => {
    try {
      const messageType = message.messageType;
      if (!message.message || !message.message[messageType] || !message.message[messageType].mimetype) {
        console.error('Missing media information in message', message);
        return null;
      }
      
      const mediaMessage = message.message[messageType];
      const extension = mime.extension(mediaMessage.mimetype);
      const bucketLocation = `${message.chatId}/${message.key.id}.${extension}`;
      
      return await getDownloadURL(ref(storage, bucketLocation));
    } catch (error) {
      console.error('Error getting media URL:', error);
      return null;
    }
  };

  const handleAudioPlay = useCallback((messageId: string) => {
    const audio = audioPlayers[messageId];
    if (!audio) return;
    
    const isPlaying = !audio.paused;
    
    // Pause all other playing audio
    Object.entries(audioPlayers).forEach(([id, otherAudio]) => {
      if (id !== messageId && otherAudio && !otherAudio.paused) {
        otherAudio.pause();
      }
    });
    
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }, [audioPlayers]);

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const toggleDescription = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, showDescription: !msg.showDescription } 
        : msg
    ));
  };

  const setAudioRef = useCallback((messageId: string, element: HTMLAudioElement | null) => {
    if (element) {
      setAudioPlayers(prev => {
        if (prev[messageId] !== element) {
          return { ...prev, [messageId]: element };
        }
        return prev;
      });
    }
  }, []);

  return (
    <div className="h-[calc(100vh-10rem)] flex flex-1 overflow-hidden max-w-full bg-gray-900 rounded-lg border border-gray-800">
      {/* Chat List Sidebar - always visible on desktop, toggleable on mobile */}
      <div className={`
        h-full
        ${isMobileView ? (showChatList ? 'block w-full' : 'hidden') : 'block w-1/4'} 
        max-w-full flex flex-col
      `}>
        <ChatTabs 
          chats={chats}
          selectedChat={selectedChat}
          loading={loading}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Chat Messages - always visible on desktop, toggleable on mobile */}
      <div className={`
        h-full
        ${isMobileView ? (showChatList ? 'hidden' : 'block w-full') : 'block w-3/4'} 
        max-w-full flex flex-col
      `}>
        {selectedChat ? (
          <ChatMessages 
            messages={messages}
            loading={messagesLoading}
            selectedChatName={typeof selectedChat.name === 'string' && selectedChat.name.trim() 
              ? selectedChat.name 
              : 'Unnamed Chat'}
            audioPlayers={audioPlayers}
            getMessageContent={getMessageContent}
            getMediaUrl={getMediaUrl}
            handleAudioPlay={handleAudioPlay}
            setAudioRef={setAudioRef}
            toggleDescription={toggleDescription}
            formatDuration={formatDuration}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 h-full">
            Select a chat to start viewing messages
          </div>
        )}
      </div>

      {error && (
        <div className="fixed bottom-4 left-4 right-4 bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;