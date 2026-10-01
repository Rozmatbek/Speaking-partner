'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Moon, Sparkles, Sun } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { isDarkMode, toggleDarkMode, setActiveTab } = useApp();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white/90 px-4 sm:px-6 backdrop-blur-xl dark:bg-zinc-950/90">
      {/* Brand Logo: Talkey */}
      <div
        onClick={() => setActiveTab('speaking')}
        className="flex cursor-pointer items-center gap-3 group"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-sky-400 text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
          <Sparkles className="h-5 w-5" />
        </div>
        <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
          Talkey
        </span>
      </div>

      {/* Right Controls: Theme Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200/80 text-zinc-600 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 transition-all cursor-pointer shadow-xs"
          aria-label="Toggle Theme"
          title="Toggle theme"
        >
          {isDarkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
};
