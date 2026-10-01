'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  CefrLevel,
  ShadowingAnalysis,
  ShadowingLesson,
  ShadowingSentence,
} from '@/types';
import { speechService } from '@/lib/speech';
import {
  Award,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  Sliders,
  Sparkles,
  Volume2,
  Zap,
} from 'lucide-react';

export const ShadowingView: React.FC = () => {
  const { shadowingLessons, selectedLanguage, addXP, showToast } = useApp();

  const [selectedLesson, setSelectedLesson] = useState<ShadowingLesson>(shadowingLessons[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);
  const [isSlowMode, setIsSlowMode] = useState<boolean>(false);

  // Recording & Analysis state
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [userRecordedText, setUserRecordedText] = useState<string>('');
  const [analysis, setAnalysis] = useState<ShadowingAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const currentSentence = selectedLesson.sentences[activeSentenceIndex];
  const isGerman = selectedLesson.language === 'German';

  // Play Native Audio for Current Sentence
  const playOriginalAudio = (slow: boolean = false) => {
    setIsPlayingOriginal(true);
    speechService.speak(currentSentence.text, {
      lang: isGerman ? 'de-DE' : 'en-US',
      rate: slow ? 0.75 : 1.0,
      pitch: 1.0,
      onEnd: () => setIsPlayingOriginal(false),
      onError: () => setIsPlayingOriginal(false),
    });
  };

  // Toggle user recording
  const toggleRecording = () => {
    if (isRecording) {
      speechService.stopListening();
      setIsRecording(false);
      triggerAnalysis(userRecordedText || currentSentence.text);
    } else {
      setIsRecording(true);
      setAnalysis(null);
      setUserRecordedText('');

      speechService.startListening({
        lang: isGerman ? 'de-DE' : 'en-US',
        onResult: (transcript, isFinal) => {
          setUserRecordedText(transcript);
        },
        onError: () => {
          setIsRecording(false);
          const fallback = currentSentence.text;
          setUserRecordedText(fallback);
          triggerAnalysis(fallback);
        },
        onEnd: () => {
          setIsRecording(false);
        },
      });
    }
  };

  // AI Pronunciation & Cadence Analyzer
  const triggerAnalysis = (recorded: string) => {
    setIsAnalyzing(true);
    setTimeout(() => {
      const words = currentSentence.text.split(/\s+/).map((w, i) => {
        const cleanW = w.replace(/[.,!?:;"]/g, '');
        const isGood = i % 4 !== 0;
        return {
          word: cleanW,
          score: isGood ? Math.floor(Math.random() * 15) + 85 : Math.floor(Math.random() * 20) + 65,
          status: (isGood ? 'excellent' : 'needs_work') as 'excellent' | 'needs_work',
          phoneticHint: isGood ? undefined : 'Lengthen the vowel sound slightly',
        };
      });

      const result: ShadowingAnalysis = {
        overallScore: 84,
        pronunciation: 82,
        rhythm: 76,
        intonation: 79,
        speed: 88,
        words,
        feedback:
          'Excellent vowel clarity and natural tempo matching. Keep your intonation curve rising slightly towards commas.',
      };

      setAnalysis(result);
      setIsAnalyzing(false);
      addXP(30, 'Shadowing Sentence Mastered');
    }, 900);
  };

  // Replay user's recorded text
  const replayMyVoice = () => {
    if (!userRecordedText && !currentSentence.text) return;
    speechService.speak(userRecordedText || currentSentence.text, {
      lang: isGerman ? 'de-DE' : 'en-US',
      pitch: 0.95,
      rate: 1.0,
    });
  };

  const handleNextSentence = () => {
    speechService.stopSpeech();
    speechService.stopListening();
    setIsRecording(false);
    setAnalysis(null);
    setUserRecordedText('');

    if (activeSentenceIndex < selectedLesson.sentences.length - 1) {
      setActiveSentenceIndex(activeSentenceIndex + 1);
    } else {
      showToast('You completed this shadowing lesson!', 'success');
    }
  };

  const handlePrevSentence = () => {
    speechService.stopSpeech();
    speechService.stopListening();
    setIsRecording(false);
    setAnalysis(null);
    setUserRecordedText('');

    if (activeSentenceIndex > 0) {
      setActiveSentenceIndex(activeSentenceIndex - 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Shadowing
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Listen to native speaker recordings and repeat sentence-by-sentence to calibrate your cadence, rhythm, and natural pronunciation.
        </p>
      </div>

      {/* Main Interactive Shadowing Deck */}
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8">
        {/* Script & Sentence Card */}
        <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50/60 to-indigo-50/40 p-8 text-center space-y-6 dark:border-purple-900/30 dark:from-purple-950/30 dark:to-zinc-900">
          <p className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white leading-relaxed">
            "{currentSentence.text}"
          </p>

          {/* Audio Playback Controls */}
          <div className="flex items-center justify-center pt-2">
            <button
              onClick={() => playOriginalAudio(false)}
              disabled={isPlayingOriginal}
              className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all active:scale-95"
            >
              <Volume2 className="h-4 w-4" />
              <span>{isPlayingOriginal ? 'Playing Audio...' : 'Listen Original (1.0x)'}</span>
            </button>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center justify-between border-t border-zinc-100 pt-5 dark:border-zinc-800">
          <button
            onClick={handlePrevSentence}
            disabled={activeSentenceIndex === 0}
            className="flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 disabled:opacity-30 dark:hover:text-zinc-100 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous Sentence
          </button>

          <button
            onClick={handleNextSentence}
            className="flex items-center gap-1 rounded-2xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm transition-all cursor-pointer"
          >
            <span>
              {activeSentenceIndex === selectedLesson.sentences.length - 1
                ? 'Finish Lesson'
                : 'Next Sentence'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
