'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { CefrLevel } from '@/types';
import { X } from 'lucide-react';

export const ProfileModal: React.FC = () => {
  const {
    userProfile,
    updateProfile,
    languages,
    selectedLanguage,
    setSelectedLanguage,
    isProfileModalOpen,
    setIsProfileModalOpen,
  } = useApp();

  if (!isProfileModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-base font-bold text-white shadow-md">
              {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                {userProfile.name}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsProfileModalOpen(false)}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile Info Form */}
        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Full Name:
            </label>
            <input
              type="text"
              value={userProfile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Target Language Selector */}
          <div>
            <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Learning Language:
            </label>
            <select
              value={selectedLanguage.code}
              onChange={(e) => {
                const found = languages.find((l) => l.code === e.target.value);
                if (found) {
                  setSelectedLanguage(found);
                  updateProfile({ learningLanguage: found.name });
                }
              }}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-semibold text-indigo-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-indigo-400 cursor-pointer outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} disabled={!l.isAvailable}>
                  {l.name} {!l.isAvailable ? '(Coming Soon)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Levels Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Current Level:
              </label>
              <select
                value={userProfile.currentLevel}
                onChange={(e) => updateProfile({ currentLevel: e.target.value as CefrLevel })}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {['Beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Target Level:
              </label>
              <select
                value={userProfile.targetLevel}
                onChange={(e) => updateProfile({ targetLevel: e.target.value as CefrLevel })}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white cursor-pointer outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
