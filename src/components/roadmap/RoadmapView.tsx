'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Award,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck2,
  Headphones,
  Lock,
  Mic,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const { userProfile, roadmap, toggleRoadmapTask, selectedLanguage } = useApp();

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'speaking':
        return Mic;
      case 'shadowing':
        return Headphones;
      case 'mock_exam':
        return FileCheck2;
      default:
        return Compass;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Personalized Curriculum
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            {userProfile.currentLevel} → {userProfile.targetLevel} Bridge
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          4-Week Mastery Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Structured week-by-week sprint engineered to elevate your conversational fluency in {selectedLanguage.name}.
        </p>
      </div>

      {/* Progress Hero */}
      <div className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/60 p-6 dark:border-indigo-900/40 dark:from-indigo-950/40 dark:via-zinc-900 dark:to-zinc-900 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Overall Roadmap Completion
            </span>
            <div className="text-3xl font-black text-zinc-900 dark:text-white mt-0.5">
              {roadmap.progressPercent}% Completed
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              You have unlocked Week 1 & 2 milestones. Complete remaining tasks to unlock certificate exams.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white border border-zinc-200 p-4 shadow-xs text-center dark:border-zinc-800 dark:bg-zinc-800">
              <span className="text-[10px] text-zinc-400 font-bold uppercase">Current</span>
              <span className="text-lg font-extrabold text-indigo-600">{userProfile.currentLevel}</span>
            </div>
            <div className="text-indigo-400 font-bold">→</div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-indigo-600 text-white p-4 shadow-md text-center shadow-indigo-600/20">
              <span className="text-[10px] text-indigo-200 font-bold uppercase">Target</span>
              <span className="text-lg font-extrabold">{userProfile.targetLevel}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 h-2 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-500"
            style={{ width: `${roadmap.progressPercent}%` }}
          />
        </div>
      </div>

      {/* 4 Weekly Modules Timeline */}
      <div className="space-y-6">
        {roadmap.weeks.map((week) => (
          <div
            key={week.weekNumber}
            className={`rounded-3xl border p-6 transition-all ${
              week.isUnlocked
                ? 'border-zinc-200 bg-white shadow-xs dark:border-zinc-800 dark:bg-zinc-900'
                : 'border-zinc-200/60 bg-zinc-50/50 opacity-65 dark:border-zinc-800/60 dark:bg-zinc-950/40'
            }`}
          >
            {/* Week Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800 gap-2">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl font-bold text-sm ${
                    week.isUnlocked
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'bg-zinc-200 text-zinc-500 dark:bg-zinc-800'
                  }`}
                >
                  {week.isUnlocked ? `W${week.weekNumber}` : <Lock className="h-4 w-4" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                      Week {week.weekNumber}: {week.theme}
                    </h3>
                  </div>
                  <span className="text-xs text-zinc-500">
                    Milestone: <strong>{week.milestoneTitle}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {week.focusSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Task list */}
            <div className="mt-4 space-y-3">
              {week.tasks.map((task) => {
                const Icon = getTaskIcon(task.type);
                return (
                  <div
                    key={task.id}
                    onClick={() => week.isUnlocked && toggleRoadmapTask(week.weekNumber, task.id)}
                    className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
                      task.completed
                        ? 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/30 dark:bg-emerald-950/20'
                        : 'border-zinc-200 bg-zinc-50/60 hover:bg-zinc-100/70 dark:border-zinc-800 dark:bg-zinc-850/50'
                    } ${week.isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
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

                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
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
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                        +{task.xpReward} XP
                      </span>
                      <span className="text-xs text-zinc-400">{task.durationMinutes}m</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
