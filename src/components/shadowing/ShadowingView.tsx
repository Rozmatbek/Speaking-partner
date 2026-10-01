'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { ShadowingLesson } from '@/types';
import { speechService } from '@/lib/speech';
import { getTranslation } from '@/lib/translations';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

export const ShadowingView: React.FC = () => {
  const { shadowingLessons, userProfile, showToast } = useApp();
  const t = getTranslation(userProfile.learningLanguage);

  const [selectedLesson] = useState<ShadowingLesson>(shadowingLessons[0]);
  const [activeSentenceIndex, setActiveSentenceIndex] = useState<number>(0);
  const [isPlayingOriginal, setIsPlayingOriginal] = useState<boolean>(false);

  const currentSentence = selectedLesson.sentences[activeSentenceIndex];
  const isGerman = selectedLesson.language === 'German';

  // Play Native Audio for Current Sentence
  const playOriginalAudio = () => {
    setIsPlayingOriginal(true);
    speechService.speak(currentSentence.text, {
      lang: isGerman ? 'de-DE' : 'en-US',
      rate: 1.0,
      pitch: 1.0,
      onEnd: () => setIsPlayingOriginal(false),
      onError: () => setIsPlayingOriginal(false),
    });
  };

  const handleNextSentence = () => {
    speechService.stopSpeech();
    setIsPlayingOriginal(false);

    if (activeSentenceIndex < selectedLesson.sentences.length - 1) {
      setActiveSentenceIndex(activeSentenceIndex + 1);
    } else {
      showToast(t.lessonCompleted, 'success');
    }
  };

  const handlePrevSentence = () => {
    speechService.stopSpeech();
    setIsPlayingOriginal(false);

    if (activeSentenceIndex > 0) {
      setActiveSentenceIndex(activeSentenceIndex - 1);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          {t.shadowingHeading}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          {t.shadowingSubheading}
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
              onClick={playOriginalAudio}
              disabled={isPlayingOriginal}
              className="flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-purple-700 shadow-md shadow-purple-600/25 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Volume2 className="h-4 w-4" />
              <span>{isPlayingOriginal ? t.playingAudio : t.listenOriginal}</span>
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
            {t.prevSentence}
          </button>

          <button
            onClick={handleNextSentence}
            className="flex items-center gap-1 rounded-2xl bg-purple-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-purple-700 shadow-sm transition-all cursor-pointer"
          >
            <span>
              {activeSentenceIndex === selectedLesson.sentences.length - 1
                ? t.finishLesson
                : t.nextSentence}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
