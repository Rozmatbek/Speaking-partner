'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AchievementBadge,
  AgeCategory,
  CefrLevel,
  FlashcardWord,
  HumanPartner,
  LanguageInfo,
  MockExamDetails,
  PartnerRequest,
  ReportReason,
  ShadowingLesson,
  UserProfile,
  UserReport,
  UserRoadmap,
  VoiceGender,
  VoiceStyle,
} from '@/types';
import {
  HUMAN_PARTNERS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_FLASHCARDS,
  INITIAL_LANGUAGES,
  MOCK_EXAMS,
  SHADOWING_LESSONS,
  generateRoadmap,
} from '@/lib/mock-data';

export type NavigationTab =
  | 'dashboard'
  | 'speaking'
  | 'partners'
  | 'shadowing'
  | 'mock-exams'
  | 'vocabulary'
  | 'roadmap'
  | 'progress'
  | 'admin'
  | 'settings'
  | 'premium';

export interface ActiveVoiceCall {
  partner: HumanPartner;
  isMuted: boolean;
  isDeafened: boolean;
  isConnecting: boolean;
  isConnected: boolean;
  startedAt: number;
}

interface AppContextType {
  userProfile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: (data: Partial<UserProfile>) => void;
  resetOnboarding: () => void;
  
  // Navigation
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  
  // Languages Catalog
  languages: LanguageInfo[];
  selectedLanguage: LanguageInfo;
  setSelectedLanguage: (lang: LanguageInfo) => void;

  // Human Speaking Partners & Safety
  partners: HumanPartner[];
  partnerRequests: PartnerRequest[];
  sendPartnerRequest: (partnerId: string, message?: string) => void;
  acceptPartnerRequest: (requestId: string) => void;
  blockedUserIds: string[];
  blockUser: (partnerId: string) => void;
  reports: UserReport[];
  submitReport: (partnerId: string, partnerName: string, reason: ReportReason, details: string) => void;
  
  // Active Voice Call (Human Peer Voice Interaction)
  activeVoiceCall: ActiveVoiceCall | null;
  startVoiceCall: (partner: HumanPartner) => void;
  endVoiceCall: () => void;
  toggleCallMute: () => void;
  toggleCallDeafen: () => void;

  // Mock Exams
  mockExams: MockExamDetails[];
  
  // Shadowing
  shadowingLessons: ShadowingLesson[];
  
  // Flashcards & Vocabulary
  flashcards: FlashcardWord[];
  addFlashcard: (card: Omit<FlashcardWord, 'id' | 'repetitionCount'>) => void;
  reviewFlashcard: (cardId: string, performance: 'Easy' | 'Medium' | 'Hard') => void;

  // Roadmap & Tasks
  roadmap: UserRoadmap;
  toggleRoadmapTask: (weekNumber: number, taskId: string) => void;

  // Gamification & XP
  achievements: AchievementBadge[];
  addXP: (amount: number, reason?: string) => void;
  incrementStreak: () => void;

  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Profile Modal State
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_default_01',
  name: 'Aziz',
  exactAge: 19,
  ageCategory: '18+',
  nativeLanguage: 'Uzbek',
  learningLanguage: 'English',
  currentLevel: 'B1',
  targetLevel: 'B2',
  goals: ['Speaking', 'Certificate Exam', 'University'],
  dailyGoalMinutes: 30,
  currentStreak: 7,
  longestStreak: 12,
  xpPoints: 480,
  level: 4,
  preferredAiVoice: {
    gender: 'Female',
    style: 'Friendly',
    voiceName: 'Samantha / Google US English',
    rate: 1.0,
    pitch: 1.1,
  },
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  isPremium: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<NavigationTab>('speaking');
  const [languages] = useState<LanguageInfo[]>(INITIAL_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo>(INITIAL_LANGUAGES[0]);
  
  const [partners, setPartners] = useState<HumanPartner[]>(HUMAN_PARTNERS);
  const [partnerRequests, setPartnerRequests] = useState<PartnerRequest[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [reports, setReports] = useState<UserReport[]>([]);
  
  const [activeVoiceCall, setActiveVoiceCall] = useState<ActiveVoiceCall | null>(null);
  
  const [mockExams] = useState<MockExamDetails[]>(MOCK_EXAMS);
  const [shadowingLessons] = useState<ShadowingLesson[]>(SHADOWING_LESSONS);
  const [flashcards, setFlashcards] = useState<FlashcardWord[]>(INITIAL_FLASHCARDS);
  const [achievements, setAchievements] = useState<AchievementBadge[]>(INITIAL_ACHIEVEMENTS);
  const [roadmap, setRoadmap] = useState<UserRoadmap>(
    generateRoadmap(DEFAULT_PROFILE.currentLevel, DEFAULT_PROFILE.targetLevel)
  );

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProfile = localStorage.getItem('linguamate_profile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUserProfile(parsed);
          setRoadmap(generateRoadmap(parsed.currentLevel || 'B1', parsed.targetLevel || 'B2'));
          const matchingLang = INITIAL_LANGUAGES.find(
            (l) => l.name.toLowerCase() === (parsed.learningLanguage || '').toLowerCase()
          );
          if (matchingLang) setSelectedLanguage(matchingLang);
        } catch (e) {
          console.error('Failed to parse stored profile', e);
        }
      }

      const savedTheme = localStorage.getItem('linguamate_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('linguamate_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('linguamate_theme', 'light');
      }
      return next;
    });
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated: UserProfile = {
        ...prev,
        ...data,
        onboardingCompleted: true,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      setRoadmap(generateRoadmap(updated.currentLevel, updated.targetLevel));
      return updated;
    });
    setActiveTab('speaking');
    showToast(`Welcome aboard, ${data.name || 'Friend'}! Your personalized journey is ready.`, 'success');
  };

  const resetOnboarding = () => {
    updateProfile({ onboardingCompleted: false });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('linguamate_profile');
    }
    showToast('Onboarding reset for demonstration.', 'info');
  };

  const sendPartnerRequest = (partnerId: string, message?: string) => {
    const partner = partners.find((p) => p.id === partnerId);
    if (!partner) return;

    const newRequest: PartnerRequest = {
      id: `req-${Date.now()}`,
      sender: {
        id: userProfile.id,
        name: userProfile.name,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
        nativeLanguage: userProfile.nativeLanguage,
        learningLanguage: userProfile.learningLanguage,
        proficiencyLevel: userProfile.currentLevel,
        ageCategory: userProfile.ageCategory,
        interests: ['Language Exchange', 'Speaking Practice'],
        availability: 'Evenings',
        preferredTopics: ['Daily life', 'Studies'],
        compatibilityScore: 95,
        onlineStatus: 'online',
        rating: 5.0,
        totalSessions: 1,
        country: 'Uzbekistan',
        flag: '🇺🇿',
        bio: 'Enthusiastic language learner on LinguaMate AI!',
      },
      receiverId: partnerId,
      status: 'pending',
      requestedAt: new Date().toISOString(),
      message: message || `Hi ${partner.name}, would love to practice ${partner.nativeLanguage} and exchange skills!`,
    };

    setPartnerRequests((prev) => [newRequest, ...prev]);
    showToast(`Practice request sent to ${partner.name}!`, 'success');
  };

  const acceptPartnerRequest = (requestId: string) => {
    setPartnerRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, status: 'accepted' } : req))
    );
    showToast('Practice request accepted! You can now start voice calling.', 'success');
  };

  const blockUser = (partnerId: string) => {
    setBlockedUserIds((prev) => [...prev, partnerId]);
    if (activeVoiceCall?.partner.id === partnerId) {
      endVoiceCall();
    }
    showToast('User has been blocked. They cannot contact or match with you.', 'warning');
  };

  const submitReport = (
    partnerId: string,
    partnerName: string,
    reason: ReportReason,
    details: string
  ) => {
    const newReport: UserReport = {
      id: `rep-${Date.now()}`,
      reportedPartnerId: partnerId,
      reportedPartnerName: partnerName,
      reason,
      details,
      timestamp: new Date().toISOString(),
      status: 'Pending Review',
    };
    setReports((prev) => [newReport, ...prev]);
    showToast('Report submitted to moderation team. Thank you for keeping our community safe.', 'info');
  };

  const startVoiceCall = (partner: HumanPartner) => {
    setActiveVoiceCall({
      partner,
      isMuted: false,
      isDeafened: false,
      isConnecting: true,
      isConnected: false,
      startedAt: Date.now(),
    });

    // Simulate WebRTC connection establishment
    setTimeout(() => {
      setActiveVoiceCall((prev) =>
        prev ? { ...prev, isConnecting: false, isConnected: true } : null
      );
      showToast(`Connected to real-time voice channel with ${partner.name} (Voice Only 🎙️)`, 'success');
    }, 1200);
  };

  const endVoiceCall = () => {
    if (activeVoiceCall) {
      const durationSeconds = Math.round((Date.now() - activeVoiceCall.startedAt) / 1000);
      showToast(`Voice session with ${activeVoiceCall.partner.name} ended (${Math.max(1, Math.round(durationSeconds / 60))}m). +40 XP!`, 'info');
      addXP(40, 'Human Voice Practice');
    }
    setActiveVoiceCall(null);
  };

  const toggleCallMute = () => {
    setActiveVoiceCall((prev) =>
      prev ? { ...prev, isMuted: !prev.isMuted } : null
    );
  };

  const toggleCallDeafen = () => {
    setActiveVoiceCall((prev) =>
      prev ? { ...prev, isDeafened: !prev.isDeafened } : null
    );
  };

  const addFlashcard = (card: Omit<FlashcardWord, 'id' | 'repetitionCount'>) => {
    const newCard: FlashcardWord = {
      ...card,
      id: `fc-${Date.now()}`,
      repetitionCount: 1,
      lastReviewed: new Date().toISOString(),
    };
    setFlashcards((prev) => [newCard, ...prev]);
    showToast(`Saved "${newCard.word}" to your personal vocabulary library!`, 'success');
    addXP(10, 'Vocabulary Saved');
  };

  const reviewFlashcard = (cardId: string, performance: 'Easy' | 'Medium' | 'Hard') => {
    setFlashcards((prev) =>
      prev.map((c) => {
        if (c.id === cardId) {
          return {
            ...c,
            difficulty: performance,
            repetitionCount: c.repetitionCount + 1,
            lastReviewed: new Date().toISOString(),
          };
        }
        return c;
      })
    );
    addXP(5, 'Flashcard Review');
  };

  const toggleRoadmapTask = (weekNumber: number, taskId: string) => {
    setRoadmap((prev) => {
      let toggledXp = 0;
      const updatedWeeks = prev.weeks.map((w) => {
        if (w.weekNumber === weekNumber) {
          const updatedTasks = w.tasks.map((t) => {
            if (t.id === taskId) {
              const newState = !t.completed;
              if (newState) toggledXp += t.xpReward;
              return { ...t, completed: newState };
            }
            return t;
          });
          return { ...w, tasks: updatedTasks };
        }
        return w;
      });

      const totalTasks = updatedWeeks.reduce((acc, w) => acc + w.tasks.length, 0);
      const completedTasks = updatedWeeks.reduce(
        (acc, w) => acc + w.tasks.filter((t) => t.completed).length,
        0
      );
      const progressPercent = Math.round((completedTasks / totalTasks) * 100);

      if (toggledXp > 0) {
        addXP(toggledXp, 'Roadmap Task Completed');
      }

      return {
        ...prev,
        weeks: updatedWeeks,
        progressPercent,
      };
    });
  };

  const addXP = (amount: number, reason?: string) => {
    setUserProfile((prev) => {
      const newXp = prev.xpPoints + amount;
      const newLevel = Math.floor(newXp / 150) + 1;
      const updated = {
        ...prev,
        xpPoints: newXp,
        level: newLevel,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      return updated;
    });

    if (reason) {
      showToast(`+${amount} XP: ${reason}`, 'success');
    }
  };

  const incrementStreak = () => {
    setUserProfile((prev) => {
      const updated = {
        ...prev,
        currentStreak: prev.currentStreak + 1,
        longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Streak updated! Keep the momentum going', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        userProfile,
        updateProfile,
        completeOnboarding,
        resetOnboarding,
        activeTab,
        setActiveTab,
        languages,
        selectedLanguage,
        setSelectedLanguage,
        partners,
        partnerRequests,
        sendPartnerRequest,
        acceptPartnerRequest,
        blockedUserIds,
        blockUser,
        reports,
        submitReport,
        activeVoiceCall,
        startVoiceCall,
        endVoiceCall,
        toggleCallMute,
        toggleCallDeafen,
        mockExams,
        shadowingLessons,
        flashcards,
        addFlashcard,
        reviewFlashcard,
        roadmap,
        toggleRoadmapTask,
        achievements,
        addXP,
        incrementStreak,
        isDarkMode,
        toggleDarkMode,
        isProfileModalOpen,
        setIsProfileModalOpen,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
