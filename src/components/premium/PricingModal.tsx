'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Check, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const PricingModal: React.FC = () => {
  const { userProfile, updateProfile, showToast } = useApp();

  const handleUpgrade = (tier: string) => {
    updateProfile({ isPremium: true });
    showToast(`🎉 Upgraded to ${tier}! All AI models and unlimited voice calling unlocked.`, 'success');
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          Startup MVP Tiering
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          Simple, Transparent Plans
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Start for free with generous daily practice limits or accelerate with Unlimited AI Speaking & Advanced Pronunciation Analytics.
        </p>
      </div>

      {/* Pricing Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 pt-4">
        {/* FREE Tier */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white">Community Free</h3>
              <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                Forever Free
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-zinc-900 dark:text-white">$0</span>
              <span className="text-xs text-zinc-400">/ month</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              Essential language tools for students and young learners.
            </p>

            <div className="mt-6 space-y-3 border-t border-zinc-100 pt-6 text-xs dark:border-zinc-800">
              {[
                'Real Human Speaking Partner requests',
                'Protected safe peer age group matching',
                'Full IELTS & Goethe Mock Exams',
                'Shadowing practice (10 lessons)',
                'Spaced repetition vocabulary deck',
                'Voice-only WebRTC communication',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300">
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            disabled={!userProfile.isPremium}
            className="mt-8 w-full rounded-2xl border border-zinc-300 bg-zinc-50 py-3 text-xs font-bold text-zinc-700 hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 transition-colors"
          >
            {userProfile.isPremium ? 'Downgrade to Free' : 'Current Active Plan'}
          </button>
        </div>

        {/* PRO Tier */}
        <div className="relative rounded-3xl border-2 border-indigo-600 bg-gradient-to-b from-indigo-50/50 via-white to-white p-6 sm:p-8 shadow-xl dark:border-indigo-500 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 flex flex-col justify-between">
          <div className="absolute -top-3.5 right-6 rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
            Most Popular
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white">LinguaMate Pro</h3>
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400">$9</span>
              <span className="text-xs text-zinc-400">/ month</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">
              For ambitious learners aiming for rapid CEFR band progression.
            </p>

            <div className="mt-6 space-y-3 border-t border-indigo-100 pt-6 text-xs dark:border-indigo-950">
              {[
                'Unlimited AI Voice Speaking Sessions',
                'Advanced Acoustic Cadence breakdown (Rhythm, Intonation, Speed)',
                'Priority Human Partner matching algorithm',
                'Detailed IELTS/Goethe examiner feedback & corrections',
                'Unlimited Shadowing library across all levels',
                'Access to Korean, Chinese, Arabic & Russian early beta',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-zinc-900 dark:text-zinc-100 font-medium">
                  <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 font-bold" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleUpgrade('LinguaMate Pro')}
            className="mt-8 w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all active:scale-95"
          >
            {userProfile.isPremium ? 'Active Pro Plan 🎉' : 'Upgrade to Pro 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};
