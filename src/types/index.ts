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
  exactAge?: number;
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
  geminiApiKey?: string;
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
  overallBand: string;
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
