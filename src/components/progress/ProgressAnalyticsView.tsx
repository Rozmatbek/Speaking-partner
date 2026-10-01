'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Flame,
  GraduationCap,
  Headphones,
  Lock,
  Mic,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

export const ProgressAnalyticsView: React.FC = () => {
  const { userProfile, achievements, flashcards, selectedLanguage } = useApp();

  const weeklyActivity = [
    { day: 'Mon', minutes: 25, active: true },
    { day: 'Tue', minutes: 35, active: true },
    { day: 'Wed', minutes: 30, active: true },
    { day: 'Thu', minutes: 40, active: true },
    { day: 'Fri', minutes: 20, active: true },
    { day: 'Sat', minutes: 45, active: true },
    { day: 'Sun', minutes: 30, active: true },
  ];

  const skillBreakdown = [
    { skill: 'Speaking & Fluency', score: 84, color: 'bg-indigo-600', text: 'text-indigo-600' },
    { skill: 'Pronunciation & Intonation', score: 82, color: 'bg-purple-600', text: 'text-purple-600' },
    { skill: 'Grammatical Accuracy', score: 79, color: 'bg-emerald-600', text: 'text-emerald-600' },
    { skill: 'Lexical Resource (Vocab)', score: 86, color: 'bg-sky-600', text: 'text-sky-600' },
    { skill: 'Listening Comprehension', score: 90, color: 'bg-amber-600', text: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Performance Metrics & Mastery
          </span>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
            Level {userProfile.level} Polyglot
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Analytics & Skill Progress
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Track speaking time, CEFR domain mastery, and milestone achievements across sessions.
        </p>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Total Study Time</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white">
            14.2 <span className="text-xs font-normal text-zinc-400">hours</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold">+18% this week</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Speaking Sessions</span>
            <Mic className="h-4 w-4 text-sky-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white">
            28 <span className="text-xs font-normal text-zinc-400">dialogues</span>
          </div>
          <span className="text-[11px] text-zinc-400">AI & Human calls</span>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-zinc-500 text-xs">
            <span>Active Lexicon</span>
            <Sparkles className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-zinc-900 dark:text-white">
            {flashcards.length} <span className="text-xs font-normal text-zinc-400">words</span>
          </div>
          <span className="text-[11px] text-zinc-400">Spaced repetition</span>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs dark:border-amber-900/30 dark:bg-amber-950/20">
          <div className="flex items-center justify-between text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <span>Streak Fire</span>
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-900 dark:text-amber-300">
            {userProfile.currentStreak} <span className="text-xs font-normal">Days</span>
          </div>
          <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80">Best: {userProfile.longestStreak} days</span>
        </div>
      </div>

      {/* 2 Big Visual Sections: Weekly Study Chart & Skill Domain Radar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Minutes Chart */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                Weekly Practice Time (Minutes)
              </h3>
              <p className="text-xs text-zinc-400">Total: 225 minutes practice this week</p>
            </div>
            <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              Avg 32m / day
            </span>
          </div>

          <div className="flex items-end justify-between gap-3 pt-6 pb-2 h-44">
            {weeklyActivity.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-300">
                  {item.minutes}m
                </span>
                <div
                  className="w-full max-w-[32px] rounded-xl bg-gradient-to-t from-indigo-600 to-sky-400 shadow-sm transition-all duration-300 hover:opacity-85"
                  style={{ height: `${(item.minutes / 50) * 100}%` }}
                />
                <span className="text-xs font-semibold text-zinc-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Domain Competence */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                CEFR Skill Domain Competence
              </h3>
              <p className="text-xs text-zinc-400">Calibrated from AI speaking, shadowing & tests</p>
            </div>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
              {userProfile.currentLevel} Level
            </span>
          </div>

          <div className="space-y-3.5 pt-2">
            {skillBreakdown.map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{item.skill}</span>
                  <span className={`font-bold ${item.text}`}>{item.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gamification Achievements & Badges */}
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Unlocked Achievements & Badges
            </h3>
            <p className="text-xs text-zinc-400">Complete challenges to earn XP and rank up</p>
          </div>
          <span className="text-xs font-bold text-indigo-600">
            {achievements.filter((a) => a.unlocked).length} / {achievements.length} Badges
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all ${
                ach.unlocked
                  ? 'border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/40 dark:bg-indigo-950/30'
                  : 'border-zinc-200/60 bg-zinc-50/50 opacity-60 dark:border-zinc-800 dark:bg-zinc-900'
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                  ach.unlocked
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-zinc-200 text-zinc-400 dark:bg-zinc-800'
                }`}
              >
                {ach.unlocked ? <Sparkles className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-white">{ach.title}</h4>
                  <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    +{ach.xp} XP
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">{ach.description}</p>
                {ach.unlocked && (
                  <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                    <CheckCircle2 className="h-3 w-3" /> Unlocked
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
