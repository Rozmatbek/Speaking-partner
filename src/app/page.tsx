'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AiSpeakingSession } from '@/components/speaking/AiSpeakingSession';
import { ShadowingView } from '@/components/shadowing/ShadowingView';
import { MockExamsView } from '@/components/mock-exams/MockExamsView';
import { ProfileModal } from '@/components/profile/ProfileModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export default function Home() {
  const { activeTab, toast } = useApp();

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-50 font-sans">
      {/* Top Navigation Bar */}
      <Navbar />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-3 sm:py-6 pb-20 md:pb-6 md:pl-64">
          <div className="mx-auto max-w-5xl">
            {activeTab === 'speaking' && <AiSpeakingSession />}
            {activeTab === 'shadowing' && <ShadowingView />}
            {activeTab === 'mock-exams' && <MockExamsView />}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <MobileNav />

      {/* Global Profile Modal */}
      <ProfileModal />

      {/* Global Toast Notifications */}
      {toast && (
        <div className="fixed bottom-20 right-4 z-50 flex items-center gap-2.5 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 text-xs font-semibold text-zinc-900 shadow-2xl backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 dark:text-white animate-bounce">
          {toast.type === 'success' && (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          )}
          {toast.type === 'warning' && (
            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
          )}
          {toast.type === 'info' && (
            <Info className="h-4 w-4 text-indigo-500 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
