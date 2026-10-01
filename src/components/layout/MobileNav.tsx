'use client';

import React from 'react';
import { NavigationTab, useApp } from '@/context/AppContext';
import { FileCheck2, Headphones, Mic, User } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsProfileModalOpen, userProfile } = useApp();

  const mobileTabs: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'speaking', label: 'Partner', icon: Mic },
    { id: 'shadowing', label: 'Shadowing', icon: Headphones },
    { id: 'mock-exams', label: 'Mock Tests', icon: FileCheck2 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-zinc-200 bg-white/95 px-2 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/95 md:hidden">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 px-3 py-1 text-xs font-semibold transition-colors ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
            }`}
          >
            <div className={`p-1.5 rounded-xl ${isActive ? 'bg-indigo-50 dark:bg-indigo-950/60' : ''}`}>
              <Icon className="h-5 w-5" />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}

      <button
        onClick={() => setIsProfileModalOpen(true)}
        className="flex flex-col items-center justify-center gap-1 px-3 py-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-[10px] font-bold text-white shadow-xs">
          {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
        </div>
        <span>Profile</span>
      </button>
    </div>
  );
};

