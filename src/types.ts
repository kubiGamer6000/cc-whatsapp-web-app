import { Timestamp } from 'firebase/firestore';

export interface LogEntry {
  id: string;
  timestamp: string | { seconds: number; nanoseconds: number };
  level: number;
  levelName: string;
  message: string;
  data: any;
}

export interface LogStats {
  totalLogs: number;
  byLevel: Record<string, number>;
  byMessageType: Record<string, number>;
  averageProcessingTime: number;
  messageFlows: Record<string, number>;
}

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: 'user' | 'admin';
  createdAt: Date | { seconds: number; nanoseconds: number };
}

export interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export interface Chat {
  id: string;
  name?: string;
  isGroup: boolean;
  lastMessage?: {
    text: string;
    timestamp: number;
  };
  lastActivityTimestamp?: number;
  knowledge?: {
    shortDescription?: string;
    fullDescription?: string;
  };
  [key: string]: any;
}

export interface WhatsAppMessage {
  id: string;
  chatId: string;
  messageTimestamp: number;
  key: {
    id: string;
    fromMe: boolean;
    remoteJid?: string;
  };
  pushName?: string;
  message?: any;
  isMedia: boolean;
  messageType: string;
  processResult?: string;
  showDescription?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  urgency: number;
  dueDate?: string;
  contactName: string;
  actions?: Action[];
  status: "pending" | "completed" | "cancelled";
  createdAt: any;
  updatedAt: any;
  contactId: string;
}

export interface Action {
  id: string;
  action: "calendar" | "email" | "whatsapp_message";
  description: string;
  status?: 'pending' | 'approved' | 'denied';
}

export interface Summary {
  id: string;
  date: Timestamp;
  summary: {
    briefWalkthroughOfTheDay: string;
    keyProgressMade: Array<{
      projectName: string;
      progressSummary: string;
    }>;
    forwardPlanning: Array<string>;
    keyReminders: Array<{
      reminderTitle: string;
      reminderDetails: string;
    }>;
    fullSummary: string;
  };
}