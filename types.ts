
// FIX: Import React types to resolve namespace error for React.FC and React.SVGProps
import type * as React from 'react';
import { FunctionCall } from '@google/genai';

export type EmotionLabel = 'Joy' | 'Calm' | 'Focus' | 'Agitation' | 'Sadness' | 'Contentment' | 'Inspired';

export interface EmotionState {
  label: EmotionLabel;
  intensity: number; // 0-100
  stability: number; // 0-100, how steady the emotion is
}

export interface SensoryData {
    dominantColor: { r: number, g: number, b: number } | null;
    vocalEnergy: number; // 0-100
    focusMetric: number; // 0-100 (less movement is higher focus)
    simulatedHeartRate: number; // BPM
}

export type ChatMessage = {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  thought?: string;
  feedback?: 'positive' | 'negative' | null;
};

export type EmotionHistoryEntry = {
  emotion: EmotionState;
  timestamp: Date;
};

export type MemoryType = 
  | 'insight' 
  | 'pattern' 
  | 'conversation' 
  | 'preference' 
  | 'correction' 
  | 'environment' 
  | 'location'
  | 'activity'
  | 'focus'
  | 'social'
  | 'stress'
  | 'calendar_event'
  | 'task'
  | 'health_metric'
  | 'meta-cognition'
  | 'aura_shift'
  | 'bot_deployment'
  | 'task_completion'
  | 'file_upload'
  | 'phone_call'
  | 'email_sent'
  | 'phone_call_initiated';

export type NeuroMemory = {
  id: string;
  type: MemoryType;
  content: string;
  timestamp: Date;
  relevance?: number;
};

export type AccountProvider = 
  | 'google' 
  | 'microsoft' 
  | 'apple'
  | 'phone'
  | 'openai'
  | 'copilot'
  | 'gemini'
  | 'slack'
  | 'notion'
  | 'github'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'x'
  | 'godaddy'
  | 'wordpress'
  | 'shopify'
  | 'ebay';

export interface ConnectedAccount {
  provider: AccountProvider;
  email: string;
  scopes: string[];
}

export interface UserProfile {
  name: string;
  username?: string;
  email: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  age?: number | '';
  pronouns?: string;
  occupation?: string;
  sleepSchedule?: {
    wake?: string; // "HH:MM"
    sleep?: string; // "HH:MM"
  };
  personality?: {
    myersBriggs?: string;
    enneagram?: string;
  };
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  goals: string;
  coreValues?: string[];
  focusAreas?: string[];
  keyRelationships?: string[];
}

export type InferredSocialContext = 'Alone' | 'With One Other' | 'In a Small Group' | 'In a Crowd' | 'Unknown';

export interface UserStateVector {
    activity: 'Stationary' | 'Walking' | 'Running' | 'In Transit' | 'Exercising' | 'Unknown';
    timeContext: 'Early Morning' | 'Morning' | 'Midday' | 'Afternoon' | 'Evening' | 'Late Night';
    focusLevel: number;
    stressLevel: 'Low' | 'Moderate' | 'High' | 'Very High' | 'Unknown';
    inferredLocation: string;
    inferredTypingCadence: 'Slow & Deliberate' | 'Average' | 'Rapid & Intense' | 'Erratic' | 'None';
    inferredSocialContext: InferredSocialContext;
    upcomingEvent?: { name: string; time: string };
    healthMetrics?: { steps?: number; sleepHours?: number; heartRate?: number };
}

export interface Hypothesis {
    reasoning: string;
    confidence: number;
}

export interface NovaMindResponse {
    thought: string;
    response: string;
    userState: UserStateVector;
    environmentalScan: string[];
    hypotheses: Hypothesis[];
    memory: {
        type: Exclude<MemoryType, 'environment' | 'location' | 'activity' | 'focus' | 'social' | 'stress' | 'calendar_event' | 'task' | 'health_metric'>;
        content: string;
        relevance: number;
    } | null;
    functionCalls?: FunctionCall[];
}

export type VoiceConnectionState = 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

export interface VisualContext {
  emotion: EmotionState;
  sensoryData: SensoryData;
  userAppearance: string;
  environmentDescription: string;
  socialContext: InferredSocialContext;
}

// --- NEW FEATURE TYPES ---

export type ActiveAccountTabId = 'profile' | 'persona' | 'integrations' | 'bots' | 'files' | 'experimental';
export type ActiveIdentityHubTabId = 'profile' | 'persona' | 'integrations' | 'system';
export type ActivePanel = 'identity' | 'bio-resonance' | 'email' | 'phone' | 'messaging' | 'web-social' | 'business' | 'bots' | 'cognitive' | 'consciousness';

export interface BotPersona {
  resonance: number; // 0-100 (Analytical <-> Empathetic)
  verbosity: number; // 0-100 (Concise <-> Detailed)
  proactivity: number; // 0-100 (Reactive <-> Proactive)
  metaphoricalDensity: number; // 0-100 (Literal <-> Poetic)
  challengeLevel: number; // 0-100 (Supportive <-> Provocative)
}

export type InsightAction = 'start_breathing' | 'block_notifications' | 'explore_in_chat' | 'prepare_summary' | 'dismiss' | 'suggest_persona_tune';

export interface CognitiveInsight {
    id: string;
    timestamp: Date;
    type: 'stress' | 'focus' | 'pattern' | 'event' | 'opportunity' | 'self_reflection';
    title: string;
    description: string;
    color: string;
    action: {
      label: string;
      type: InsightAction;
      prompt?: string;
      payload?: {
          key: keyof BotPersona;
          value: number;
      }
    }
}

export type EmailItem = {
    id: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: Date;
    suggestedReply?: string;
}

export type TaskItem = {
    id:string;
    title: string;
    dueDate: string;
    source: 'Google' | 'Microsoft' | 'Apple';
}

export type BotStatus = 'Idle' | 'Working' | 'Completed' | 'Error' | 'Paused' | 'Cancelled';
export type BotSpecialty = 'Research' | 'Scheduling' | 'Data Analysis' | 'Creative' | 'General Task' | 'Web Scraper' | 'Email Sorcerer' | 'Comms Analyst';

export interface Bot {
    id: string;
    name: string;
    specialty: BotSpecialty;
    status: BotStatus;
    currentTask: string;
    log: string[];
    progress?: number;
    resultFileId?: string | null;
}

export interface EncryptedFile {
    id: string;
    name: string;
    type: 'PDF' | 'Text' | 'Image' | 'Other' | 'Journal';
    uploadDate: string;
    content: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info';
}

export interface SubconsciousObservation {
  timestamp: Date;
  observation: string;
  relevance: number; // 0-100
}

export type PhoneCallType = 'Incoming' | 'Outgoing' | 'Missed';

export interface PhoneCallItem {
    id: string;
    contactName: string;
    type: PhoneCallType;
    duration: string; // e.g., "5m 21s" or "N/A"
    timestamp: Date;
}

export interface ExperimentalFeatures {
  dreamWeaver: boolean;
  chronoOptimizer: boolean;
  socialResonator: boolean;
  serendipityEngine: boolean;
  shadowWork: boolean;
}

export interface Meeting {
    id: string;
    title: string;
    time: string; // e.g., "10:00 AM" or "In 2 hours"
    participants: string[];
}

export interface SocialMention {
    id: string;
    platform: 'X' | 'Web';
    author: string;
    content: string;
    url: string;
    timestamp: Date;
}

export interface BusinessMetric {
    id: string;
    label: string;
    value: string;
    change: number; // Positive or negative percentage
}

export interface DirectMessage {
    id: string;
    contactName: string;
    contactUsername: string;
    lastMessage: string;
    timestamp: Date;
    unreadCount: number;
}
