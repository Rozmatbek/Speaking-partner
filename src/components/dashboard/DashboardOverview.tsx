'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  FileCheck2,
  Flame,
  Globe,
  Headphones,
  Mic,
  Play,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export const DashboardOverview: React.FC = () => {
  const {
    userProfile,
    setActiveTab,
    selectedLanguage,
    roadmap,
    toggleRoadmapTask,
    flashcards,
    incrementStreak,
  } = useApp();

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const isGerman = selectedLanguage.code === 'de';

  // Grab current week's tasks from roadmap
  const currentWeek = roadmap.weeks[0];

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* 1. Header & Personal Profile Overview */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Personalized Learning Hub
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              AI Powered
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            {getGreeting()}, {userProfile.name} 👋
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Let's make today count. You are on track to reach{' '}
            <strong className="text-zinc-900 dark:text-zinc-200">{userProfile.targetLevel}</strong> fluency in{' '}
            {selectedLanguage.name}.
          </p>
        </div>

        {/* Action quick badge */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('speaking')}
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Mic className="h-4 w-4" />
            <span>Start AI Speaking</span>
          </button>
        </div>
      </div>

      {/* 2. Key Stats Ribbon */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Language & Level Pill */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Target Lang</span>
            <span className="text-lg">{selectedLanguage.flagEmoji}</span>
          </div>
          <div className="mt-2 text-base font-extrabold text-zinc-900 dark:text-white">
            {selectedLanguage.name}
          </div>
          <div className="mt-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {userProfile.currentLevel} → {userProfile.targetLevel}
          </div>
        </div>

        {/* Progress % */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Progress</span>
            <Target className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-zinc-900 dark:text-white">
            {roadmap.progressPercent}%
          </div>
          <div className="mt-1 text-xs text-zinc-500">
            Bridge to {userProfile.targetLevel}
          </div>
        </div>

        {/* Daily Goal */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Daily Goal</span>
            <Clock className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-zinc-900 dark:text-white">
            20 / {userProfile.dailyGoalMinutes} <span className="text-xs font-normal text-zinc-400">min</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full rounded-full bg-sky-500 w-[66%]" />
          </div>
        </div>

        {/* Streak */}
        <div className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4 shadow-xs dark:border-amber-900/30 dark:from-amber-950/20 dark:to-orange-950/10">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span>Current Streak</span>
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-2 text-xl font-extrabold text-amber-900 dark:text-amber-300">
            {userProfile.currentStreak} Days 🔥
          </div>
          <div className="mt-1 text-xs text-amber-700/80 dark:text-amber-400/80">
            Keep practicing daily!
          </div>
        </div>
      </div>

      {/* 3. Main Four Core Feature Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Core Practice Modes
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* 1. AI Speaking Partner */}
          <div
            onClick={() => setActiveTab('speaking')}
            className="group cursor-pointer rounded-3xl border border-indigo-200/70 bg-gradient-to-b from-indigo-50/80 via-white to-white p-6 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all dark:border-indigo-900/40 dark:from-indigo-950/30 dark:via-zinc-900 dark:to-zinc-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-zinc-900 dark:text-white">
              AI Speaking
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Talk with your customized AI partner ({userProfile.preferredAiVoice.gender}, {userProfile.preferredAiVoice.style}) with real-time feedback.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:underline">
              <span>Start Speaking Session</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* 2. Human Partner */}
          <div
            onClick={() => setActiveTab('partners')}
            className="group cursor-pointer rounded-3xl border border-emerald-200/70 bg-gradient-to-b from-emerald-50/80 via-white to-white p-6 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all dark:border-emerald-900/40 dark:from-emerald-950/30 dark:via-zinc-900 dark:to-zinc-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-zinc-900 dark:text-white">
              Human Partner
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Practice with real native learners in protected peer groups. Voice-only real human voice call.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">
              <span>Find Speaking Peer</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* 3. Shadowing Lab */}
          <div
            onClick={() => setActiveTab('shadowing')}
            className="group cursor-pointer rounded-3xl border border-purple-200/70 bg-gradient-to-b from-purple-50/80 via-white to-white p-6 shadow-xs hover:border-purple-400 hover:shadow-md transition-all dark:border-purple-900/40 dark:from-purple-950/30 dark:via-zinc-900 dark:to-zinc-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Headphones className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-zinc-900 dark:text-white">
              Shadowing Lab
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Echo native speakers sentence-by-sentence. Measure pronunciation, rhythm, intonation & speed.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:underline">
              <span>Practice Pronunciation</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

          {/* 4. Mock Exams */}
          <div
            onClick={() => setActiveTab('mock-exams')}
            className="group cursor-pointer rounded-3xl border border-sky-200/70 bg-gradient-to-b from-sky-50/80 via-white to-white p-6 shadow-xs hover:border-sky-400 hover:shadow-md transition-all dark:border-sky-900/40 dark:from-sky-950/30 dark:via-zinc-900 dark:to-zinc-900"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-md shadow-sky-600/30 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-extrabold text-zinc-900 dark:text-white">
              Mock Exam
            </h3>
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Full IELTS Speaking Parts 1-3, IELTS Writing, and Goethe B1/B2 tests with AI band estimates.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 group-hover:underline">
              <span>Take Certificate Mock</span>
              <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>

        </div>
      </div>

      {/* 4. Today's Roadmap Tasks & Weekly Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Today's Tasks */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                Today's Action Tasks
              </h3>
              <p className="text-xs text-zinc-500">
                Week 1: {currentWeek?.theme || 'Speaking Foundations'}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('roadmap')}
              className="text-xs font-bold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              View Full 4-Week Plan
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {currentWeek?.tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => toggleRoadmapTask(1, task.id)}
                className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                  task.completed
                    ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                    : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-850/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-lg border ${
                      task.completed
                        ? 'border-emerald-600 bg-emerald-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800'
                    }`}
                  >
                    {task.completed && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold ${
                        task.completed
                          ? 'text-zinc-500 line-through'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {task.title}
                    </h4>
                    <p className="text-[11px] text-zinc-400">{task.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                    +{task.xpReward} XP
                  </span>
                  <span className="text-xs text-zinc-400">{task.durationMinutes}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Vocabulary Quick Review Widget */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                  Spaced Vocabulary
                </h3>
              </div>
              <span className="text-xs font-bold text-indigo-600">
                {flashcards.length} words
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              {flashcards.slice(0, 3).map((card) => (
                <div
                  key={card.id}
                  className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-850/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {card.word}
                    </span>
                    <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {card.level}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500 italic truncate">
                    {card.translation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('vocabulary')}
            className="mt-4 w-full rounded-xl border border-indigo-200 bg-indigo-50/60 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-300 transition-colors"
          >
            Review All Flashcards 🎴
          </button>
        </div>
      </div>
    </div>
  );
};
