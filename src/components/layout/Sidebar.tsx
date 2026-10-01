'use client';

import React from 'react';
import { NavigationTab, useApp } from '@/context/AppContext';
import { getTranslation } from '@/lib/translations';
import { FileCheck2, Headphones, Mic } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile, setIsProfileModalOpen } = useApp();
  const t = getTranslation(userProfile.learningLanguage);

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'speaking', label: t.navPartner, icon: Mic },
    { id: 'shadowing', label: t.navShadowing, icon: Headphones },
    { id: 'mock-exams', label: t.navMockTests, icon: FileCheck2 },
  ];

  return (
    <aside className="fixed left-0 top-16 bottom-0 hidden w-64 flex-col justify-between border-r border-zinc-200/60 bg-white/90 p-4 backdrop-blur-xl dark:border-zinc-800/60 dark:bg-zinc-950/90 md:flex z-20">
      <div className="space-y-6">
        {/* Section Title */}
        <div className="px-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {t.modulesTitle}
          </p>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`group flex w-full items-center rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/80 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-zinc-100 text-zinc-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-zinc-900 dark:text-zinc-400 dark:group-hover:bg-zinc-800 dark:group-hover:text-zinc-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span>{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Clean Minimal Profile Card */}
      <div className="pt-4 border-t border-zinc-200/50 dark:border-zinc-800/50">
        <button
          onClick={() => setIsProfileModalOpen(true)}
          className="group flex w-full items-center gap-3.5 rounded-2xl border border-zinc-200/80 bg-zinc-50/60 p-2.5 text-left transition-all hover:border-indigo-400/80 hover:bg-indigo-50/30 hover:shadow-md dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:hover:border-indigo-500/40 dark:hover:bg-zinc-900 cursor-pointer"
          title={t.profile}
        >
          {/* Circular Avatar */}
          <div className="relative shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 text-sm font-black text-white shadow-md">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            {/* Green Online Dot */}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-zinc-950" />
          </div>

          {/* User Name Only */}
          <span className="truncate text-sm font-extrabold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {userProfile.name}
          </span>
        </button>
      </div>
    </aside>
  );
};
