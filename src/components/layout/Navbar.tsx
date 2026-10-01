'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sparkles, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-zinc-200 bg-white/90 px-4 sm:px-6 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/90">
      {/* Clean Brand Logo */}
      <div
        onClick={() => setActiveTab('speaking')}
        className="flex cursor-pointer items-center gap-2.5"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 text-white shadow-md shadow-indigo-500/20">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          LinguaMate<span className="text-indigo-600 dark:text-indigo-400">.ai</span>
        </span>
      </div>

      {/* Right Controls: Theme Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
          aria-label="Toggle Theme"
          title="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};

