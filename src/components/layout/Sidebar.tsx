'use client';

import React from 'react';
import { NavigationTab, useApp } from '@/context/AppContext';
import { FileCheck2, Headphones, Mic, Settings2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, selectedLanguage, setIsProfileModalOpen } = useApp();

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'speaking', label: 'Partner', icon: Mic },
    { id: 'shadowing', label: 'Shadowing', icon: Headphones },
    { id: 'mock-exams', label: 'Mock Tests', icon: FileCheck2 },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 hidden w-60 flex-col justify-between border-r border-zinc-200 bg-white/80 p-4 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80 md:flex z-20">
      <div className="space-y-4">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Speaking Modules
        </p>

        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Card at Bottom of Sidebar */}
      <div className="pt-2">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex w-full items-center gap-3 rounded-2xl border border-zinc-200/80 bg-zinc-50/80 p-2.5 text-left transition-all hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-xs dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 cursor-pointer"
          title="Click to view & edit profile"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-xs">
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <span className="truncate text-sm font-bold text-zinc-900 dark:text-zinc-100">
            {userProfile.name}
          </span>
        </button>
      </div>
    </aside>
  );
};

