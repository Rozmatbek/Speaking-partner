'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CefrLevel, VoiceGender, VoiceStyle } from '@/types';
import { speechService } from '@/lib/speech';
import {
  Check,
  CheckCircle2,
  Clock,
  Globe,
  Lock,
  Play,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Volume2,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { userProfile, updateProfile, selectedLanguage, showToast, resetOnboarding } = useApp();

  const [name, setName] = useState<string>(userProfile.name);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>(userProfile.preferredAiVoice.gender);
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>(userProfile.preferredAiVoice.style);
  const [targetLevel, setTargetLevel] = useState<CefrLevel>(userProfile.targetLevel);
  const [dailyMinutes, setDailyMinutes] = useState<number>(userProfile.dailyGoalMinutes);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim() || 'Learner',
      targetLevel,
      dailyGoalMinutes: dailyMinutes,
      preferredAiVoice: {
        ...userProfile.preferredAiVoice,
        gender: voiceGender,
        style: voiceStyle,
      },
    });
    showToast('Preferences successfully updated!', 'success');
  };

  const handlePreviewVoice = () => {
    setIsPlayingPreview(true);
    const phrase =
      selectedLanguage.code === 'de'
        ? 'Hallo! Deine Spracheinstellungen wurden erfolgreich konfiguriert.'
        : "Hi! I'm your AI speaking partner. Let's practice speaking and achieve your goals together.";

    speechService.speak(phrase, {
      lang: selectedLanguage.code === 'de' ? 'de-DE' : 'en-US',
      gender: voiceGender,
      style: voiceStyle,
      onEnd: () => setIsPlayingPreview(false),
      onError: () => setIsPlayingPreview(false),
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Account & Preferences
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Voice & Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Customize your AI speaking companion, audio speed, daily goals, and safety parameters.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 pb-3 dark:border-zinc-800">
            Learner Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Display Name:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                Target CEFR Level:
              </label>
              <select
                value={targetLevel}
                onChange={(e) => setTargetLevel(e.target.value as CefrLevel)}
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
              >
                {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Privacy & Safe Peer Mode */}
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/30">
            <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              <span>Safe Peer Category: {userProfile.ageCategory}</span>
            </div>
            <p className="mt-1 text-emerald-700 dark:text-emerald-400 text-[11px]">
              Exact age ({userProfile.exactAge}) is never revealed to any speaking partners.
            </p>
          </div>
        </div>

        {/* AI Speaking Voice Customizer */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              AI Speaking Voice Preference
            </h3>
            <button
              type="button"
              onClick={handlePreviewVoice}
              disabled={isPlayingPreview}
              className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>{isPlayingPreview ? 'Testing...' : 'Test Voice Audio'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setVoiceGender('Female')}
              className={`rounded-2xl border p-4 text-left transition-all ${
                voiceGender === 'Female'
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-850'
              }`}
            >
              <span className="text-2xl">👩</span>
              <h4 className="mt-2 text-xs font-bold text-zinc-900 dark:text-white">Female Voice</h4>
              <p className="text-[10px] text-zinc-400">Natural tone</p>
            </button>

            <button
              type="button"
              onClick={() => setVoiceGender('Male')}
              className={`rounded-2xl border p-4 text-left transition-all ${
                voiceGender === 'Male'
                  ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60'
                  : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-850'
              }`}
            >
              <span className="text-2xl">👨</span>
              <h4 className="mt-2 text-xs font-bold text-zinc-900 dark:text-white">Male Voice</h4>
              <p className="text-[10px] text-zinc-400">Warm tone</p>
            </button>
          </div>

          {/* Voice Style */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-600 dark:text-zinc-400">
              Voice Style & Personality
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['Friendly', 'Professional', 'Calm', 'Energetic'] as VoiceStyle[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setVoiceStyle(st)}
                  className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                    voiceStyle === st
                      ? 'border-indigo-600 bg-indigo-600 text-white shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white border-b border-zinc-100 pb-3 dark:border-zinc-800">
            Daily Study Commitment
          </h3>
          <div className="flex items-center gap-2">
            {[10, 20, 30, 60, 90].map((min) => (
              <button
                key={min}
                type="button"
                onClick={() => setDailyMinutes(min)}
                className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition-all ${
                  dailyMinutes === min
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                }`}
              >
                {min}m
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={resetOnboarding}
            className="text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 underline"
          >
            Re-run 10-Step Onboarding Wizard
          </button>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/25 transition-all"
          >
            <Save className="h-4 w-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
};
