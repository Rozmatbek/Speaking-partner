// Domain Type Definitions for LinguaMate AI

export type AgeCategory = 'Under 16' | '16–17' | '18+';

export type CefrLevel = 'Beginner' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export type VoiceGender = 'Female' | 'Male';

export type VoiceStyle = 'Friendly' | 'Professional' | 'Calm' | 'Energetic';

export type StudyGoal = 
  | 'Speaking'
  | 'Certificate Exam'
  | 'University'
  | 'Work'
  | 'Travel'
  | 'School'
  | 'General Communication';

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  flagEmoji: string;
  isAvailable: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  exactAge?: number; // Kept strictly private
  ageCategory: AgeCategory;
  nativeLanguage: string;
  learningLanguage: string;
  currentLevel: CefrLevel;
  targetLevel: CefrLevel;
  goals: StudyGoal[];
  dailyGoalMinutes: number;
  currentStreak: number;
  longestStreak: number;
  xpPoints: number;
  level: number;
  preferredAiVoice: {
    gender: VoiceGender;
    style: VoiceStyle;
    voiceName: string;
    rate: number;
    pitch: number;
  };
  onboardingCompleted: boolean;
  createdAt: string;
  isPremium?: boolean;
}

// AI Placement Test Types
export interface PlacementQuestion {
  id: number;
  type: 'multiple_choice' | 'audio_listen' | 'speak_prompt';
  question: string;
  context?: string;
  options?: string[];
  correctAnswer?: string;
  cefrTarget: CefrLevel;
  audioPrompt?: string;
}

export interface PlacementTestResult {
  estimatedLevel: CefrLevel;
  scores: {
    vocabulary: number;
    grammar: number;
    fluency: number;
    pronunciation: number;
    coherence: number;
    comprehension: number;
  };
  summary: string;
  recommendedFocus: string[];
}

// AI Speaking Partner Types
export type SpeakingTopicCategory = 
  | 'Casual Conversation'
  | 'Daily Life'
  | 'Travel'
  | 'School'
  | 'University'
  | 'Job Interview'
  | 'IELTS Speaking'
  | 'Goethe Speaking'
  | 'TestDaF Speaking'
  | 'Custom Topic';

export interface SpeakingMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  audioUrl?: string;
}

export interface SpeakingMistake {
  mistake: string;
  correction: string;
  explanation: string;
}

export interface SpeakingFeedback {
  sessionId: string;
  durationSeconds: number;
  totalExchanges: number;
  estimatedLevel: CefrLevel;
  scores: {
    fluency: number;
    grammar: number;
    vocabulary: number;
    pronunciation: number;
    coherence: number;
  };
  mistakes: SpeakingMistake[];
  betterAlternatives: string[];
  usefulVocabulary: { word: string; meaning: string; level: CefrLevel }[];
  pronunciationTips: string[];
}

// Human Speaking Partner Types
export interface HumanPartner {
  id: string;
  name: string;
  avatarUrl: string;
  nativeLanguage: string;
  learningLanguage: string;
  proficiencyLevel: CefrLevel;
  ageCategory: AgeCategory; // Notice exact age is NEVER exposed
  interests: string[];
  availability: string;
  preferredTopics: string[];
  compatibilityScore: number;
  onlineStatus: 'online' | 'busy' | 'offline';
  rating: number;
  totalSessions: number;
  country: string;
  flag: string;
  bio: string;
}

export interface PartnerRequest {
  id: string;
  sender: HumanPartner;
  receiverId: string;
  status: 'pending' | 'accepted' | 'declined';
  requestedAt: string;
  message?: string;
}

export type ReportReason = 
  | 'Inappropriate behavior'
  | 'Harassment'
  | 'Spam'
  | 'Unsafe communication'
  | 'Other';

export interface UserReport {
  id: string;
  reportedPartnerId: string;
  reportedPartnerName: string;
  reason: ReportReason;
  details: string;
  timestamp: string;
  status: 'Pending Review' | 'Resolved' | 'Dismissed';
}

// Mock Exam Types
export type ExamType = 
  | 'IELTS Speaking'
  | 'IELTS Writing'
  | 'TOEFL Speaking'
  | 'Goethe B1 Speaking'
  | 'Goethe B2 Speaking'
  | 'TestDaF Speaking'
  | 'CEFR Assessment'
  | 'TOEFL Speaking (Coming Soon)';

export interface MockExamSection {
  title: string;
  instructions: string;
  durationMinutes: number;
  questions: {
    id: string;
    prompt: string;
    cueCardBulletPoints?: string[];
    prepTimeSec?: number;
    speakTimeSec?: number;
  }[];
}

export interface MockExamDetails {
  id: string;
  type: ExamType;
  language: 'English' | 'German';
  title: string;
  badge: string;
  difficulty: CefrLevel;
  estimatedTime: string;
  description: string;
  sections: MockExamSection[];
}

export interface MockExamResult {
  examId: string;
  examTitle: string;
  overallBand: string; // e.g. "Band 7.5" or "B2 (84/100)"
  cefrEquivalent: CefrLevel;
  criteria: {
    fluency: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
    taskAchievement?: number;
  };
  keyStrengths: string[];
  areasForImprovement: string[];
  examinerNotes: string;
  completedAt: string;
}

// Shadowing Types
export interface ShadowingSentence {
  id: number;
  text: string;
  pinyinOrPhonetic?: string;
  translation: string;
  startTime: number;
  endTime: number;
  nativeAudioUrl?: string;
}

export interface ShadowingLesson {
  id: string;
  language: string;
  level: CefrLevel;
  category: string;
  title: string;
  description: string;
  speaker: string;
  duration: string;
  sentences: ShadowingSentence[];
}

export interface WordAnalysis {
  word: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'needs_work';
  phoneticHint?: string;
}

export interface ShadowingAnalysis {
  overallScore: number;
  pronunciation: number;
  rhythm: number;
  intonation: number;
  speed: number;
  words: WordAnalysis[];
  feedback: string;
}

// Vocabulary Flashcards Types
export interface FlashcardWord {
  id: string;
  word: string;
  language: string;
  translation: string;
  phonetic: string;
  level: CefrLevel;
  exampleSentence: string;
  partOfSpeech: string;
  category: string;
  source: 'Conversation' | 'Shadowing' | 'Mock Exam' | 'System Core';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  repetitionCount: number;
  lastReviewed?: string;
  nextReview?: string;
}

// Learning Roadmap
export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  type: 'speaking' | 'grammar' | 'vocabulary' | 'listening' | 'shadowing' | 'mock_exam';
  durationMinutes: number;
  completed: boolean;
  xpReward: number;
}

export interface RoadmapWeek {
  weekNumber: number;
  theme: string;
  focusSkills: string[];
  tasks: RoadmapTask[];
  milestoneTitle: string;
  isUnlocked: boolean;
}

export interface UserRoadmap {
  currentLevel: CefrLevel;
  targetLevel: CefrLevel;
  weeks: RoadmapWeek[];
  progressPercent: number;
}

// Gamification
export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  unlockedAt?: string;
}

// Admin Panel Models
export interface AdminMetrics {
  totalUsers: number;
  activeToday: number;
  aiSessionsCount: number;
  humanCallsCount: number;
  mockExamsCompleted: number;
  reportsPending: number;
  premiumSubscribers: number;
}
