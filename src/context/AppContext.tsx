'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  LanguageInfo,
  MockExamDetails,
  ShadowingLesson,
  UserProfile,
} from '@/types';
import {
  INITIAL_LANGUAGES,
  MOCK_EXAMS,
  SHADOWING_LESSONS,
} from '@/lib/mock-data';

export type NavigationTab = 'speaking' | 'shadowing' | 'mock-exams';

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

  // Mock Exams & Shadowing
  mockExams: MockExamDetails[];
  shadowingLessons: ShadowingLesson[];
  
  // XP Gamification
  addXP: (amount: number, reason?: string) => void;

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
  onboardingCompleted: true,
  createdAt: new Date().toISOString(),
  isPremium: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [activeTab, setActiveTab] = useState<NavigationTab>('speaking');
  const [languages] = useState<LanguageInfo[]>(INITIAL_LANGUAGES);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageInfo>(INITIAL_LANGUAGES[0]);
  
  const [mockExams] = useState<MockExamDetails[]>(MOCK_EXAMS);
  const [shadowingLessons] = useState<ShadowingLesson[]>(SHADOWING_LESSONS);

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
          const lang = INITIAL_LANGUAGES.find(
            (l) => l.name.toLowerCase() === parsed.learningLanguage?.toLowerCase()
          );
          if (lang) setSelectedLanguage(lang);
        } catch {
          // ignore parsing error
        }
      }

      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedTheme = localStorage.getItem('linguamate_theme');
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

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

  const showToast = (
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'info'
  ) => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, 3500);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Profile updated', 'success');
  };

  const completeOnboarding = (data: Partial<UserProfile>) => {
    const updated: UserProfile = {
      ...userProfile,
      ...data,
      onboardingCompleted: true,
    };
    setUserProfile(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('linguamate_profile', JSON.stringify(updated));
    }
    showToast('Welcome to LinguaMate!', 'success');
    setActiveTab('speaking');
  };

  const resetOnboarding = () => {
    const reset = { ...DEFAULT_PROFILE, onboardingCompleted: false };
    setUserProfile(reset);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('linguamate_profile');
    }
    setActiveTab('speaking');
  };

  const addXP = (amount: number, reason?: string) => {
    setUserProfile((prev) => {
      const newXP = prev.xpPoints + amount;
      const newLevel = Math.floor(newXP / 150) + 1;
      const updated = { ...prev, xpPoints: newXP, level: newLevel };
      if (typeof window !== 'undefined') {
        localStorage.setItem('linguamate_profile', JSON.stringify(updated));
      }
      return updated;
    });
    showToast(`+${amount} XP ${reason ? `• ${reason}` : ''}`, 'success');
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
        mockExams,
        shadowingLessons,
        addXP,
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
