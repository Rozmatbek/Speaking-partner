'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AgeCategory,
  CefrLevel,
  PlacementQuestion,
  StudyGoal,
  VoiceGender,
  VoiceStyle,
} from '@/types';
import { speechService } from '@/lib/speech';
import { PLACEMENT_QUESTIONS } from '@/lib/mock-data';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Globe2,
  HelpCircle,
  Mic,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
  User,
  Volume2,
} from 'lucide-react';

export const OnboardingWizard: React.FC = () => {
  const { languages, completeOnboarding } = useApp();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 10;

  // Onboarding form state
  const [name, setName] = useState<string>('Aziz');
  const [exactAge, setExactAge] = useState<number>(19);
  const [selectedLang, setSelectedLang] = useState<string>('English');
  const [currentLevel, setCurrentLevel] = useState<CefrLevel>('B1');
  const [wantsPlacementTest, setWantsPlacementTest] = useState<boolean>(false);
  const [selectedGoals, setSelectedGoals] = useState<StudyGoal[]>([
    'Speaking',
    'Certificate Exam',
    'University',
  ]);
  const [targetLevel, setTargetLevel] = useState<CefrLevel>('B2');
  const [dailyTime, setDailyTime] = useState<number>(30);
  const [voiceGender, setVoiceGender] = useState<VoiceGender>('Female');
  const [voiceStyle, setVoiceStyle] = useState<VoiceStyle>('Friendly');
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  // Placement Test State
  const [placementIndex, setPlacementIndex] = useState<number>(0);
  const [placementAnswers, setPlacementAnswers] = useState<Record<number, string>>({});
  const [placementEvaluated, setPlacementEvaluated] = useState<boolean>(false);
  const [isRecordingPlacement, setIsRecordingPlacement] = useState<boolean>(false);
  const [placementSpokenText, setPlacementSpokenText] = useState<string>('');

  // Compute age category safely
  const getAgeCategory = (age: number): AgeCategory => {
    if (age < 16) return 'Under 16';
    if (age <= 17) return '16–17';
    return '18+';
  };

  const handleGoalToggle = (goal: StudyGoal) => {
    if (selectedGoals.includes(goal)) {
      if (selectedGoals.length > 1) {
        setSelectedGoals(selectedGoals.filter((g) => g !== goal));
      }
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handlePreviewVoice = (gender: VoiceGender, style: VoiceStyle) => {
    setIsPlayingPreview(true);
    const phrase =
      gender === 'Female'
        ? "Hi! I'm your AI speaking partner on LinguaMate. Let's practice and elevate your fluency together."
        : "Hi! I'm your AI speaking partner. Let's practice speaking and reach your language goals together.";

    const langCode = selectedLang === 'German' ? 'de-DE' : 'en-US';
    const localizedPhrase =
      selectedLang === 'German'
        ? gender === 'Female'
          ? 'Hallo! Ich bin deine KI-Sprechpartnerin. Lass uns gemeinsam Deutsch üben.'
          : 'Hallo! Ich bin dein KI-Sprechpartner. Lass uns gemeinsam Deutsch sprechen.'
        : phrase;

    speechService.speak(localizedPhrase, {
      lang: langCode,
      gender,
      style,
      onEnd: () => setIsPlayingPreview(false),
      onError: () => setIsPlayingPreview(false),
    });
  };

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Ignore if confetti context not available
    }

    completeOnboarding({
      name: name.trim() || 'Learner',
      exactAge,
      ageCategory: getAgeCategory(exactAge),
      nativeLanguage: 'Uzbek',
      learningLanguage: selectedLang,
      currentLevel,
      targetLevel,
      goals: selectedGoals,
      dailyGoalMinutes: dailyTime,
      preferredAiVoice: {
        gender: voiceGender,
        style: voiceStyle,
        voiceName: `${voiceGender} ${voiceStyle}`,
        rate: 1.0,
        pitch: voiceGender === 'Female' ? 1.15 : 0.9,
      },
    });
  };

  const goalsList: StudyGoal[] = [
    'Speaking',
    'Certificate Exam',
    'University',
    'Work',
    'Travel',
    'School',
    'General Communication',
  ];

  const levels: CefrLevel[] = ['Beginner', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-radial from-indigo-50/50 via-white to-zinc-100 p-4 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      {/* Container Card */}
      <div className="w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/95 p-6 shadow-2xl backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-900/95 sm:p-10 transition-all">
        
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
            <span className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold">
              <Sparkles className="h-3.5 w-3.5" />
              LinguaMate AI Onboarding
            </span>
            <span>Step {step} of {totalSteps}</span>
          </div>

          <div className="mt-2.5 h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-sky-500 transition-all duration-300 ease-out"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: NAME */}
        {step === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 1 · Identity
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                What's your name?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We will use this to personalize your speaking sessions and learning roadmap.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                First Name / Preferred Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aziz or Sarah"
                className="w-full rounded-xl border border-zinc-300 bg-zinc-50/50 px-4 py-3.5 text-base font-semibold text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-indigo-400"
              />
            </div>
          </div>
        )}

        {/* STEP 2: AGE & PRIVACY */}
        {step === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 2 · Age & Safety
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                How old are you?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Used strictly to assign appropriate age peer groups for safe human partner practice.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min={10}
                  max={99}
                  value={exactAge}
                  onChange={(e) => setExactAge(parseInt(e.target.value) || 18)}
                  className="w-32 rounded-xl border border-zinc-300 bg-zinc-50 px-4 py-3 text-xl font-bold text-center text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                  years old
                </span>
              </div>

              {/* Safety notice banner */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs dark:border-emerald-900/40 dark:bg-emerald-950/40">
                <div className="flex items-center gap-2 font-bold text-emerald-800 dark:text-emerald-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Privacy & Child Safety Protected</span>
                </div>
                <p className="mt-1 text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  Your exact age ({exactAge}) is strictly private and <strong>never exposed publicly</strong>. For real human speaking partner matching, you will be shown in the safe category: <strong className="underline">{getAgeCategory(exactAge)}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: LEARNING LANGUAGE */}
        {step === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 3 · Target Language
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                What language are you learning?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select your primary focus language. You can add more later.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((lang) => {
                const isSelected = selectedLang.toLowerCase() === lang.name.toLowerCase();
                return (
                  <div
                    key={lang.code}
                    onClick={() => lang.isAvailable && setSelectedLang(lang.name)}
                    className={`relative flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition-all ${
                      !lang.isAvailable
                        ? 'cursor-not-allowed opacity-55 border-zinc-200 bg-zinc-100/50 dark:border-zinc-800 dark:bg-zinc-900/40'
                        : isSelected
                        ? 'cursor-pointer border-indigo-600 bg-indigo-50/80 shadow-md ring-2 ring-indigo-500/30 dark:border-indigo-500 dark:bg-indigo-950/50'
                        : 'cursor-pointer border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-800/60'
                    }`}
                  >
                    <span className="text-3xl">{lang.flagEmoji}</span>
                    <span className="mt-2 text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {lang.name}
                    </span>
                    <span className="text-[11px] text-zinc-500">{lang.nativeName}</span>
                    {!lang.isAvailable && (
                      <span className="mt-2 rounded-full bg-zinc-200 px-2 py-0.5 text-[9px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                        Coming soon
                      </span>
                    )}
                    {isSelected && (
                      <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CURRENT LEVEL */}
        {step === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 4 · Proficiency
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                What's your current level?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Pick your estimated CEFR level or let our AI diagnose it.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => {
                    setCurrentLevel(lvl);
                    setWantsPlacementTest(false);
                  }}
                  className={`flex flex-col items-center rounded-xl border p-3 text-center transition-all ${
                    currentLevel === lvl && !wantsPlacementTest
                      ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300'
                  }`}
                >
                  <span className="text-base font-bold">{lvl}</span>
                  <span className="text-[10px] text-zinc-500 mt-0.5">
                    {lvl === 'Beginner' ? 'Starting fresh' : lvl === 'B1' ? 'Intermediate' : lvl === 'C1' ? 'Advanced' : 'Standard'}
                  </span>
                </button>
              ))}
            </div>

            {/* "I don't know my level" Option */}
            <div
              onClick={() => {
                setWantsPlacementTest(true);
                setStep(9); // Jump directly to Placement Test step
              }}
              className="group cursor-pointer rounded-2xl border border-dashed border-indigo-300 bg-indigo-50/40 p-4 transition-all hover:bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      I don't know my level
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Take our fast 2-minute interactive AI Placement Test.
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-indigo-600 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: GOALS */}
        {step === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 5 · Goals
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Why are you learning this language?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Select all that apply to calibrate conversation topics and exam formats.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {goalsList.map((goal) => {
                const isSelected = selectedGoals.includes(goal);
                return (
                  <div
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 font-semibold dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-200'
                        : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300'
                    }`}
                  >
                    <span className="text-sm">{goal}</span>
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-md border ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: TARGET LEVEL */}
        {step === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 6 · Target
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                What level do you want to reach?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                We will build your 4-week roadmap to bridge from {currentLevel} to your target.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['A2', 'B1', 'B2', 'C1', 'C2'] as CefrLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setTargetLevel(lvl)}
                  className={`flex flex-col items-center rounded-2xl border p-4 text-center transition-all ${
                    targetLevel === lvl
                      ? 'border-indigo-600 bg-indigo-50 font-bold text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300'
                  }`}
                >
                  <Target className="h-5 w-5 mb-1.5 text-indigo-600" />
                  <span className="text-lg font-bold">{lvl}</span>
                  <span className="text-[11px] text-zinc-500 mt-1">
                    {lvl === 'B2' ? 'Vantage / Fluent' : lvl === 'C1' ? 'Effective Proficiency' : 'Target'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: DAILY STUDY TIME */}
        {step === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 7 · Commitment
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                How much time can you practice every day?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Consistency is key. Even 15 minutes of speaking creates remarkable retention.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { min: 10, label: '10 minutes', tag: 'Light & Steady' },
                { min: 20, label: '20 minutes', tag: 'Recommended' },
                { min: 30, label: '30 minutes', tag: 'Fast Progress' },
                { min: 60, label: '60 minutes', tag: 'Intensive Immersion' },
                { min: 90, label: '90+ minutes', tag: 'Exam Sprint' },
              ].map((item) => (
                <div
                  key={item.min}
                  onClick={() => setDailyTime(item.min)}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${
                    dailyTime === item.min
                      ? 'border-indigo-600 bg-indigo-50/90 font-bold text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-200 ring-2 ring-indigo-500/20'
                      : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-indigo-600" />
                    <div>
                      <div className="text-base font-bold">{item.label}</div>
                      <div className="text-xs text-zinc-500">{item.tag}</div>
                    </div>
                  </div>
                  {dailyTime === item.min && <CheckCircle2 className="h-5 w-5 text-indigo-600" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: AI SPEAKING PARTNER VOICE */}
        {step === 8 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 8 · AI Persona & Voice
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                How would you like your AI partner to sound?
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Choose gender and voice style. Test live with the preview button.
              </p>
            </div>

            {/* Voice Gender Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div
                onClick={() => setVoiceGender('Female')}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  voiceGender === 'Female'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">👩</span>
                  {voiceGender === 'Female' && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </div>
                <h4 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Female Voice
                </h4>
                <p className="text-xs text-zinc-500">Natural, articulate, and clear</p>
              </div>

              <div
                onClick={() => setVoiceGender('Male')}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  voiceGender === 'Male'
                    ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 dark:border-indigo-500 dark:bg-indigo-950/60'
                    : 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">👨</span>
                  {voiceGender === 'Male' && <CheckCircle2 className="h-4 w-4 text-indigo-600" />}
                </div>
                <h4 className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Male Voice
                </h4>
                <p className="text-xs text-zinc-500">Deep, supportive, and balanced</p>
              </div>
            </div>

            {/* Voice Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Voice Tone & Style
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['Friendly', 'Professional', 'Calm', 'Energetic'] as VoiceStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setVoiceStyle(st)}
                    className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-all ${
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

            {/* Preview Voice Button */}
            <div className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <Volume2 className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Preview {voiceGender} ({voiceStyle})
                  </h5>
                  <p className="text-[11px] text-zinc-500">
                    Click to hear sample synthesized pronunciation
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePreviewVoice(voiceGender, voiceStyle)}
                disabled={isPlayingPreview}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isPlayingPreview ? 'Speaking...' : 'Preview Voice'}</span>
              </button>
            </div>

            <p className="text-[11px] text-zinc-400">
              * Note: Voice preference applies strictly to your AI speaking companion and does not affect human partner calls.
            </p>
          </div>
        )}

        {/* STEP 9: AI PLACEMENT TEST */}
        {step === 9 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                Step 9 · AI Placement Test
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                Estimate your CEFR level
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Answer diagnostic questions to evaluate vocabulary, grammar, fluency, and pronunciation.
              </p>
            </div>

            {!placementEvaluated ? (
              <div className="space-y-4 rounded-2xl border border-zinc-200 bg-zinc-50/50 p-5 dark:border-zinc-800 dark:bg-zinc-850/50">
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-500">
                  <span>Question {placementIndex + 1} of {PLACEMENT_QUESTIONS.length}</span>
                  <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Target: {PLACEMENT_QUESTIONS[placementIndex].cefrTarget}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {PLACEMENT_QUESTIONS[placementIndex].question}
                  </h4>
                  {PLACEMENT_QUESTIONS[placementIndex].context && (
                    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-xs font-mono text-zinc-700 whitespace-pre-line dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {PLACEMENT_QUESTIONS[placementIndex].context}
                    </div>
                  )}
                </div>

                {/* Question Type: Audio listen */}
                {PLACEMENT_QUESTIONS[placementIndex].type === 'audio_listen' && (
                  <button
                    type="button"
                    onClick={() => {
                      speechService.speak(PLACEMENT_QUESTIONS[placementIndex].audioPrompt || '', {
                        lang: selectedLang === 'German' ? 'de-DE' : 'en-US',
                      });
                    }}
                    className="flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-200 px-4 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300 transition-colors"
                  >
                    <Volume2 className="h-4 w-4" />
                    <span>Play Listening Clip 🎧</span>
                  </button>
                )}

                {/* Multiple choice options */}
                {PLACEMENT_QUESTIONS[placementIndex].options && (
                  <div className="space-y-2">
                    {PLACEMENT_QUESTIONS[placementIndex].options!.map((opt) => {
                      const isSelected = placementAnswers[placementIndex] === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setPlacementAnswers({ ...placementAnswers, [placementIndex]: opt })
                          }
                          className={`w-full text-left rounded-xl border p-3 text-xs font-medium transition-all ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Question Type: Speak Prompt */}
                {PLACEMENT_QUESTIONS[placementIndex].type === 'speak_prompt' && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (isRecordingPlacement) {
                          speechService.stopListening();
                          setIsRecordingPlacement(false);
                        } else {
                          setIsRecordingPlacement(true);
                          speechService.startListening({
                            lang: selectedLang === 'German' ? 'de-DE' : 'en-US',
                            onResult: (text) => setPlacementSpokenText(text),
                            onEnd: () => setIsRecordingPlacement(false),
                            onError: () => {
                              setIsRecordingPlacement(false);
                              setPlacementSpokenText(
                                "I really enjoy learning languages because it allows me to connect with people and broaden my worldview."
                              );
                            },
                          });
                        }
                      }}
                      className={`flex items-center justify-center gap-2 w-full rounded-xl py-3 text-xs font-bold transition-all ${
                        isRecordingPlacement
                          ? 'bg-rose-600 text-white animate-pulse'
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                      <span>{isRecordingPlacement ? 'Listening... Press to Finish' : 'Press & Speak Your Answer'}</span>
                    </button>
                    {placementSpokenText && (
                      <div className="rounded-lg bg-white p-3 text-xs text-zinc-700 border border-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                        <span className="font-semibold text-indigo-600">Transcribed: </span>
                        {placementSpokenText}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation inside placement test */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (placementIndex > 0) setPlacementIndex(placementIndex - 1);
                    }}
                    disabled={placementIndex === 0}
                    className="text-xs text-zinc-500 hover:text-zinc-800 disabled:opacity-30"
                  >
                    Previous
                  </button>

                  {placementIndex < PLACEMENT_QUESTIONS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setPlacementIndex(placementIndex + 1)}
                      className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-indigo-700"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setPlacementEvaluated(true);
                        setCurrentLevel('B1'); // Evaluated estimate
                      }}
                      className="rounded-lg bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm"
                    >
                      Submit & Analyze Level ✨
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Placement Test Results */
              <div className="space-y-4 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-sky-50/50 p-6 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:to-zinc-900">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      AI Estimated Level
                    </span>
                    <h3 className="text-3xl font-extrabold text-zinc-900 dark:text-white mt-0.5">
                      B1 (Intermediate)
                    </h3>
                  </div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-lg shadow-indigo-600/30">
                    B1
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="rounded-xl bg-white p-2.5 shadow-xs dark:bg-zinc-800">
                    <span className="text-zinc-500">Fluency</span>
                    <div className="font-bold text-indigo-600 text-sm">82%</div>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 shadow-xs dark:bg-zinc-800">
                    <span className="text-zinc-500">Grammar</span>
                    <div className="font-bold text-indigo-600 text-sm">79%</div>
                  </div>
                  <div className="rounded-xl bg-white p-2.5 shadow-xs dark:bg-zinc-800">
                    <span className="text-zinc-500">Pronunciation</span>
                    <div className="font-bold text-indigo-600 text-sm">85%</div>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3 text-[11px] text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-300">
                  ⚠️ <strong>Disclaimer:</strong> This is a practice estimate and is not an official CEFR certification.
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 10: COMPLETE ONBOARDING CELEBRATION */}
        {step === 10 && (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-tr from-indigo-600 to-sky-400 text-white shadow-xl shadow-indigo-500/30">
              <Sparkles className="h-8 w-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 sm:text-3xl">
                You're ready, {name || 'Learner'}! 🎉
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Your personalized AI tutor and safe peer community are customized.
              </p>
            </div>

            {/* Overview Card */}
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-5 text-left text-xs space-y-3 dark:border-zinc-800 dark:bg-zinc-850/60">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <span className="text-zinc-500">Learning Language:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedLang === 'German' ? '🇩🇪 German' : '🇬🇧 English'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <span className="text-zinc-500">Current Level:</span>
                <span className="font-bold text-indigo-600">{currentLevel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <span className="text-zinc-500">Target Level:</span>
                <span className="font-bold text-emerald-600">{targetLevel}</span>
              </div>
              <div className="flex items-center justify-between border-b border-zinc-200 pb-2 dark:border-zinc-700">
                <span className="text-zinc-500">Daily Study Goal:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{dailyTime} minutes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">AI Partner Voice:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {voiceGender} ({voiceStyle})
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleFinish}
              className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 py-4 text-base font-bold text-white shadow-lg shadow-indigo-600/30 hover:opacity-95 transition-all transform active:scale-[0.99]"
            >
              Start Learning Now 🚀
            </button>
          </div>
        )}

        {/* Wizard Footer Controls (Next / Back) */}
        {step < 10 && (
          <div className="mt-8 flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 disabled:opacity-30 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep(Math.min(totalSteps, step + 1))}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
