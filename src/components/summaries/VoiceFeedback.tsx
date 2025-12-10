import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, X, Send, Trash2, CheckCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';
import { storage, db } from '@/firebase';

interface VoiceFeedbackProps {
  summaryId: string;
}

const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ summaryId }) => {
  const [showPill, setShowPill] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showNotification, setShowNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const durationIntervalRef = useRef<number>();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        clearInterval(durationIntervalRef.current);
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start duration counter
      setRecordingDuration(0);
      durationIntervalRef.current = window.setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const discardRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    setAudioBlob(null);
    setShowPill(false);
    clearInterval(durationIntervalRef.current);
    setRecordingDuration(0);
    
    // Show notification
    setShowNotification({
      type: 'error',
      message: 'Recording discarded'
    });
    setTimeout(() => setShowNotification(null), 3000);
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const uploadFeedback = async () => {
    if (!audioBlob) return;

    try {
      const feedbackId = uuidv4();
      const filePath = `feedback/${feedbackId}.webm`;
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, audioBlob);
      
      await addDoc(collection(db, 'feedback'), {
        fileBucketPath: filePath,
        feedbackType: 'summary',
        summaryId,
        createdAt: new Date()
      });

      setAudioBlob(null);
      setShowPill(false);
      
      // Show success notification
      setShowNotification({
        type: 'success',
        message: 'Recording sent'
      });
      setTimeout(() => setShowNotification(null), 3000);
    } catch (error) {
      console.error('Error uploading feedback:', error);
      
      // Show error notification
      setShowNotification({
        type: 'error',
        message: 'Failed to send recording'
      });
      setTimeout(() => setShowNotification(null), 3000);
    }
  };

  return (
    <>
      {/* Main Feedback Button */}
      <AnimatePresence>
        {!showPill && (
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setShowPill(true)}
            className="fixed bottom-6 right-6 p-4 rounded-full 
              bg-gradient-to-br from-blue-500/20 to-blue-500/5
              shadow-[inset_0_1px_0_0_rgba(59,130,246,0.1)]
              backdrop-blur-lg border border-white/10
              hover:border-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6 text-blue-400" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Recording Controls */}
      <AnimatePresence mode="wait">
        {showPill && (
          <motion.div
            key="recording-pill"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 flex justify-center"
          >
            <div className="bg-black/80 backdrop-blur-xl rounded-full border border-white/10 p-4 flex items-center gap-4">
              {isRecording ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping" />
                      <div className="relative w-3 h-3 bg-red-500 rounded-full" />
                    </div>
                    <span className="text-white text-sm">
                      Recording... {formatDuration(recordingDuration)}
                    </span>
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={discardRecording}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button
                      onClick={stopRecording}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5 text-blue-400" />
                    </motion.button>
                  </div>
                </>
              ) : audioBlob ? (
                <>
                  <span className="text-white text-sm">Send feedback?</span>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={discardRecording}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button
                      onClick={uploadFeedback}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Send className="w-5 h-5 text-blue-400" />
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <Mic className="w-5 h-5 text-blue-400" />
                    <span className="text-white text-sm">Ready to record</span>
                  </div>

                  <div className="h-6 w-px bg-white/10" />

                  <div className="flex items-center gap-2">
                    <motion.button
                      onClick={() => setShowPill(false)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </motion.button>
                    <motion.button
                      onClick={startRecording}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mic className="w-5 h-5 text-blue-400" />
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* Status Notification */}
        {showNotification && (
          <motion.div
            key="notification"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 inset-x-0 flex justify-center"
          >
            <div className={`
              flex items-center gap-2 px-4 py-2 rounded-full 
              backdrop-blur-xl border
              ${showNotification.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
              }
            `}>
              {showNotification.type === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
              <span className="text-sm">{showNotification.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceFeedback;