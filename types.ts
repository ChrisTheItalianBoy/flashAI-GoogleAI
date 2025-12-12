
export interface SRSData {
  nextReview: number; // Timestamp
  interval: number;   // Days
  easeFactor: number; // Multiplier (default 2.5)
  repetitions: number;
}

export interface Flashcard {
  id: string; // Added ID for accurate tracking
  question: string;
  answer: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  srsData?: SRSData; // Spaced Repetition Data
  relatedCardIds?: string[]; // New: For Knowledge Graph connections
}

export interface FlashcardSet {
  id: string;
  userId: string;
  topic: string;
  subject?: string; // New: Course or Subject name (e.g. "Math 101")
  cards: Flashcard[];
  createdAt: number;
}

export enum AppStatus {
  LANDING = 'LANDING',
  PRICING = 'PRICING',
  USE_CASES = 'USE_CASES',
  ABOUT = 'ABOUT',
  FAQ = 'FAQ',
  CONTACT = 'CONTACT',
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  STUDYING = 'STUDYING',
  DASHBOARD = 'DASHBOARD',
  SETTINGS = 'SETTINGS',
  ERROR = 'ERROR',
  PAYMENT = 'PAYMENT',
  ADMIN_DASHBOARD = 'ADMIN_DASHBOARD'
}

export interface GenerateOptions {
  count: number;
  focus: string;
  subject: string; 
  complexity?: 'Minimal' | 'Intermediate' | 'Advanced'; // New: Detail level for Pro users
  manualContext?: string; // New: For processing specific parts of a file (Pro)
}

export interface UploadedFile {
  name: string;
  mimeType: string;
  data: string;
}

export interface UserPreferences {
  defaultCount: number;
  marketingEmails: boolean;
  productUpdates: boolean;
  dailyStudyReminder: boolean;
  darkMode?: boolean;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  status: 'active' | 'canceled' | 'past_due';
  cardLast4?: string;
  nextBillingDate?: number;
}

export interface User {
  email: string;
  name?: string;
  password?: string;
  role: 'user' | 'admin';
  preferences: UserPreferences;
  subscription: UserSubscription;
  createdAt: number;
  generationHistory: number[];
  isVerified?: boolean; // New: Email verification status
  verificationCode?: string; // New: Temporary code for verification
}
