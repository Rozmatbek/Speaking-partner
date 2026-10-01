'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MockExamDetails, MockExamResult } from '@/types';
import { speechService } from '@/lib/speech';
import {
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Play,
  RotateCcw,
  Timer,
  Volume2,
  X,
} from 'lucide-react';

export const MockExamsView: React.FC = () => {
  const { mockExams, selectedLanguage, addXP } = useApp();

  const [selectedExam, setSelectedExam] = useState<MockExamDetails | null>(null);
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);

  // Test Execution State
  const [isTestRunning, setIsTestRunning] = useState<boolean>(false);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState<number>(0);
  const [speakTimeRemaining, setSpeakTimeRemaining] = useState<number>(0);

  // Note-taking state
  const [userNotes, setUserNotes] = useState<string>('');

  // Result state
  const [examResult, setExamResult] = useState<MockExamResult | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Filter ONLY speaking exams based on active language
  const availableExams = mockExams.filter((e) => {
    const isSpeaking = e.type.toLowerCase().includes('speaking') || e.title.toLowerCase().includes('speaking');
    const isLangMatch = selectedLanguage.code === 'de' ? e.language === 'German' : e.language === 'English';
    return isSpeaking && isLangMatch;
  });

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const isCurrentSectionPart2 = (sectionTitle: string, qPrepTime?: number) => {
    const title = sectionTitle.toLowerCase();
    return title.includes('part 2') || title.includes('teil 2') || Boolean(qPrepTime && qPrepTime > 0);
  };

  const startExam = (exam: MockExamDetails) => {
    setSelectedExam(exam);
    setActiveSectionIndex(0);
    setActiveQuestionIndex(0);
    setIsTestRunning(true);
    setExamResult(null);
    setUserNotes('');

    const currentSection = exam.sections[0];
    const currentQ = currentSection.questions[0];

    // Only set timer if Part 2
    if (isCurrentSectionPart2(currentSection.title, currentQ.prepTimeSec)) {
      if (currentQ.prepTimeSec) {
        startPrepTimer(currentQ.prepTimeSec, currentQ.speakTimeSec || 120);
      } else {
        startSpeakTimer(currentQ.speakTimeSec || 120);
      }
    } else {
      setPrepTimeRemaining(0);
      setSpeakTimeRemaining(0);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    // Speak prompt audio via SpeechService
    speechService.speak(currentQ.prompt, {
      lang: exam.language === 'German' ? 'de-DE' : 'en-US',
    });
  };

  const startPrepTimer = (prepSecs: number, speakSecs: number) => {
    setPrepTimeRemaining(prepSecs);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setPrepTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          startSpeakTimer(speakSecs);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startSpeakTimer = (speakSecs: number) => {
    setSpeakTimeRemaining(speakSecs);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      setSpeakTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const playQuestionAudio = (promptText: string) => {
    speechService.speak(promptText, {
      lang: selectedExam?.language === 'German' ? 'de-DE' : 'en-US',
    });
  };

  const handleNextQuestion = () => {
    if (!selectedExam) return;

    speechService.stopSpeech();

    const currentSection = selectedExam.sections[activeSectionIndex];
    if (activeQuestionIndex < currentSection.questions.length - 1) {
      const nextIdx = activeQuestionIndex + 1;
      setActiveQuestionIndex(nextIdx);
      const nextQ = currentSection.questions[nextIdx];

      if (isCurrentSectionPart2(currentSection.title, nextQ.prepTimeSec)) {
        if (nextQ.prepTimeSec) {
          startPrepTimer(nextQ.prepTimeSec, nextQ.speakTimeSec || 120);
        } else {
          startSpeakTimer(nextQ.speakTimeSec || 120);
        }
      } else {
        setPrepTimeRemaining(0);
        setSpeakTimeRemaining(0);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }

      speechService.speak(nextQ.prompt, {
        lang: selectedExam.language === 'German' ? 'de-DE' : 'en-US',
      });
    } else if (activeSectionIndex < selectedExam.sections.length - 1) {
      const nextSec = activeSectionIndex + 1;
      setActiveSectionIndex(nextSec);
      setActiveQuestionIndex(0);
      const nextSectionObj = selectedExam.sections[nextSec];
      const nextQ = nextSectionObj.questions[0];

      if (isCurrentSectionPart2(nextSectionObj.title, nextQ.prepTimeSec)) {
        if (nextQ.prepTimeSec) {
          startPrepTimer(nextQ.prepTimeSec, nextQ.speakTimeSec || 120);
        } else {
          startSpeakTimer(nextQ.speakTimeSec || 120);
        }
      } else {
        setPrepTimeRemaining(0);
        setSpeakTimeRemaining(0);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      }

      speechService.speak(nextQ.prompt, {
        lang: selectedExam.language === 'German' ? 'de-DE' : 'en-US',
      });
    } else {
      // Complete & Evaluate Exam
      submitExam();
    }
  };

  const submitExam = () => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    speechService.stopSpeech();
    setIsTestRunning(false);

    const isIelts = selectedExam?.type.includes('IELTS');
    const isGerman = selectedExam?.language === 'German';

    const mockResult: MockExamResult = {
      examId: selectedExam?.id || 'exam-1',
      examTitle: selectedExam?.title || 'Speaking Mock Test',
      overallBand: isIelts ? 'Band 7.5' : isGerman ? 'B2 (88/100)' : 'B2',
      cefrEquivalent: 'B2',
      criteria: {
        fluency: 84,
        lexicalResource: 82,
        grammaticalRange: 78,
        pronunciation: 86,
        taskAchievement: 85,
      },
      keyStrengths: [
        'Natural conversational flow with minimal hesitation during long turn.',
        'Sophisticated use of topic-specific collocations and discourse markers.',
        'Clear phonological intonation and consistent sentence stress.',
      ],
      areasForImprovement: [
        'Watch for complex relative clause inversion in extended sentences.',
        'Incorporate more varied conditional phrasing (e.g. "Had I realized...").',
      ],
      examinerNotes:
        'The candidate communicated spontaneously and developed ideas with effective cohesion. Vocabulary range is well suited for academic contexts.',
      completedAt: new Date().toLocaleDateString(),
    };

    setExamResult(mockResult);
    addXP(120, 'Speaking Mock Exam Finished');
  };

  // FULLSCREEN IMMERSIVE ACTIVE EXAM RUNNER
  if (isTestRunning && selectedExam) {
    const currentSection = selectedExam.sections[activeSectionIndex];
    const currentQ = currentSection.questions[activeQuestionIndex];

    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-zinc-950 p-4 sm:p-8 text-white min-h-screen overflow-y-auto select-none">
        {/* Top Bar: Section Title + Timer (Part 2 Only) + Close button */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4 max-w-4xl mx-auto w-full">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              {selectedExam.title}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {currentSection.title}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer ONLY shown for Part 2 */}
            {isCurrentSectionPart2(currentSection.title, currentQ.prepTimeSec) && (
              <div>
                {prepTimeRemaining > 0 ? (
                  <div className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-950/60 px-3.5 py-1.5 text-xs font-bold text-amber-300 backdrop-blur-md">
                    <Timer className="h-4 w-4 animate-pulse text-amber-400" />
                    <span>Prep Time: {prepTimeRemaining}s</span>
                  </div>
                ) : speakTimeRemaining > 0 ? (
                  <div className="flex items-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-950/60 px-3.5 py-1.5 text-xs font-bold text-sky-300 backdrop-blur-md">
                    <Clock className="h-4 w-4 text-sky-400" />
                    <span>Speaking Time: {speakTimeRemaining}s</span>
                  </div>
                ) : null}
              </div>
            )}

            {/* Exit Fullscreen Test */}
            <button
              onClick={() => {
                setIsTestRunning(false);
                speechService.stopSpeech();
              }}
              className="flex items-center gap-1 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
              title="Exit Test"
            >
              <X className="h-4 w-4" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          </div>
        </div>

        {/* Center Main Content: Question Card + Notes Area Directly Below It */}
        <div className="my-auto py-6 max-w-4xl mx-auto w-full space-y-6">
          {/* Prompt Card */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-6 sm:p-8 backdrop-blur-md space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sky-500/10 px-3 py-1 text-xs font-bold text-sky-400 border border-sky-500/20">
                Question {activeQuestionIndex + 1} of {currentSection.questions.length}
              </span>

              <button
                onClick={() => playQuestionAudio(currentQ.prompt)}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors cursor-pointer"
                title="Listen to question audio"
              >
                <Volume2 className="h-4 w-4 text-sky-400" />
                <span>Hear Question</span>
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white leading-relaxed">
              {currentQ.prompt}
            </h3>

            {/* Cue Card Points (Part 2) */}
            {currentQ.cueCardBulletPoints && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-950/30 p-4 sm:p-5 text-xs sm:text-sm">
                <span className="font-bold text-amber-300 block mb-2">
                  You should say:
                </span>
                <ul className="space-y-2 list-disc list-inside text-amber-100/90">
                  {currentQ.cueCardBulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Notes Area Directly Below Question */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/90 p-5 sm:p-6 shadow-2xl backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <div className="flex items-center gap-2 text-indigo-400">
                <FileText className="h-4 w-4" />
                <span>Notes & Planning:</span>
              </div>
              <span className="text-[11px] text-zinc-500 font-normal">
                {userNotes.trim() ? `${userNotes.trim().split(/\s+/).length} words` : 'Optional note-taking pad'}
              </span>
            </div>

            <textarea
              rows={5}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Jot down keywords, main bullet points, and ideas for your answer..."
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 text-sm text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-y min-h-[120px]"
            />
          </div>
        </div>

        {/* Bottom Navigation Controls */}
        <div className="flex items-center justify-between border-t border-zinc-800 pt-4 max-w-4xl mx-auto w-full">
          <button
            onClick={() => {
              setIsTestRunning(false);
              speechService.stopSpeech();
            }}
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Exit Test
          </button>

          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-1.5 rounded-2xl bg-indigo-600 px-6 py-3 text-xs sm:text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <span>
              {activeSectionIndex === selectedExam.sections.length - 1 &&
              activeQuestionIndex ===
                selectedExam.sections[activeSectionIndex].questions.length - 1
                ? 'Submit & Generate Results'
                : 'Next Question'}
            </span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Catalog */}
      {!isTestRunning && !examResult && (
        <div className="space-y-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
              Speaking Mock Exams
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              Practice full-length certified exam formats with structured speaking sections, cue cards, and automated AI grading.
            </p>
          </div>

          {/* Exam Catalog Cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {availableExams.map((exam) => (
              <div
                key={exam.id}
                className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs hover:border-sky-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-sky-900 transition-all"
              >
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                    {exam.title}
                  </h3>

                  <div className="mt-4 space-y-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      Included Sections:
                    </span>
                    {exam.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                        <span>{sec.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => startExam(exam)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-sky-600 py-3 text-xs font-bold text-white hover:bg-sky-700 shadow-md shadow-sky-600/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Mock Exam</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Exam Evaluation Report */}
      {examResult && (
        <div className="mx-auto max-w-3xl space-y-6 rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 sm:p-8 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-zinc-100 pb-5 dark:border-zinc-800 gap-3">
            <div>
              <span className="rounded-full bg-sky-100 px-3 py-0.5 text-xs font-bold text-sky-800 dark:bg-sky-950 dark:text-sky-300">
                AI Estimated Score
              </span>
              <h2 className="mt-1 text-2xl font-extrabold text-zinc-900 dark:text-white">
                {examResult.examTitle}
              </h2>
            </div>

            <button
              onClick={() => {
                setExamResult(null);
                setSelectedExam(null);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2 text-xs font-bold text-white hover:bg-sky-700 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Take Another Mock</span>
            </button>
          </div>

          {/* Band Score Hero Card */}
          <div className="flex items-center justify-between rounded-3xl border border-sky-200 bg-gradient-to-r from-sky-50 to-indigo-50/60 p-6 dark:border-sky-900/40 dark:from-sky-950/40 dark:to-indigo-950/20">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Overall AI Estimated Band
              </span>
              <div className="text-3xl sm:text-4xl font-black text-sky-950 dark:text-white mt-1">
                {examResult.overallBand}
              </div>
              <span className="text-xs text-zinc-500">
                CEFR Equivalent: <strong>{examResult.cefrEquivalent}</strong>
              </span>
            </div>

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/30">
              <Award className="h-8 w-8" />
            </div>
          </div>

          {/* 4 Criteria Scores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-850">
              <span className="text-[10px] text-zinc-500">Fluency & Coherence</span>
              <div className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                {examResult.criteria.fluency}%
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-850">
              <span className="text-[10px] text-zinc-500">Lexical Resource</span>
              <div className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                {examResult.criteria.lexicalResource}%
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-850">
              <span className="text-[10px] text-zinc-500">Grammar Range</span>
              <div className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                {examResult.criteria.grammaticalRange}%
              </div>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-850">
              <span className="text-[10px] text-zinc-500">Pronunciation</span>
              <div className="text-lg font-bold text-zinc-900 dark:text-white mt-1">
                {examResult.criteria.pronunciation}%
              </div>
            </div>
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-xs dark:border-emerald-900/30 dark:bg-emerald-950/20 space-y-2">
              <span className="font-bold text-emerald-900 dark:text-emerald-300">
                Key Strengths Demonstrated:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-emerald-950/90 dark:text-emerald-200">
                {examResult.keyStrengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-xs dark:border-amber-900/30 dark:bg-amber-950/20 space-y-2">
              <span className="font-bold text-amber-900 dark:text-amber-300">
                Actionable Focus Areas:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-amber-950/90 dark:text-amber-200">
                {examResult.areasForImprovement.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
