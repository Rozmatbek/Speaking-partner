'use client';

import React, { useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { speechService } from '@/lib/speech';
import { aiProvider } from '@/lib/ai-provider';
import { getTranslation } from '@/lib/translations';
import { SpeakingMessage } from '@/types';
import {
  Mic,
  MicOff,
  PhoneOff,
} from 'lucide-react';

interface PartnerAvatar {
  id: string;
  name: string;
  avatarUrl: string;
  voiceGender: 'Female' | 'Male';
  voiceStyle: 'Friendly' | 'Professional' | 'Calm' | 'Energetic';
  personality: string;
}

// 1 Female (Emma) and 1 Male (Lucas) Partner
const PARTNER_AVATARS: PartnerAvatar[] = [
  {
    id: 'p-emma',
    name: 'Emma',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    voiceGender: 'Female',
    voiceStyle: 'Friendly',
    personality: 'Friendly, clear, and articulate native British English speaker',
  },
  {
    id: 'p-lucas',
    name: 'Lucas',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    voiceGender: 'Male',
    voiceStyle: 'Calm',
    personality: 'Calm, engaging, and natural conversational partner',
  },
];

type EmotionState = 'idle' | 'listening' | 'thinking' | 'speaking';

export const AiSpeakingSession: React.FC = () => {
  const { userProfile } = useApp();
  const t = getTranslation(userProfile.learningLanguage);

  const [selectedPartner, setSelectedPartner] = useState<PartnerAvatar>(PARTNER_AVATARS[0]);
  const [isFullScreenCall, setIsFullScreenCall] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<EmotionState>('idle');

  // Subtitles & Dialogue State
  const [partnerSubtitle, setPartnerSubtitle] = useState<string>('');
  const [userLiveSubtitle, setUserLiveSubtitle] = useState<string>('');

  // Conversation history for multi-turn Gemini AI
  const conversationHistoryRef = useRef<SpeakingMessage[]>([]);

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const streamPartnerSubtitle = (fullText: string) => {
    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
    const words = fullText.split(' ');
    let currentIdx = 0;
    setPartnerSubtitle('');

    const intervalMs = Math.max(140, Math.min(240, Math.floor(3600 / Math.max(words.length, 1))));

    typewriterIntervalRef.current = setInterval(() => {
      currentIdx++;
      setPartnerSubtitle(words.slice(0, currentIdx).join(' '));
      if (currentIdx >= words.length) {
        if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
      }
    }, intervalMs);
  };

  const startVoiceCall = (partner: PartnerAvatar) => {
    setSelectedPartner(partner);
    setIsFullScreenCall(true);
    setIsMuted(false);
    setUserLiveSubtitle('');
    conversationHistoryRef.current = [];

    const isGerman = userProfile.learningLanguage.toLowerCase().includes('german');
    const initialGreeting = isGerman
      ? `Hallo ${userProfile.name}! Schön dich kennenzulernen. Ich bin ${partner.name}. Worüber möchtest du heute sprechen?`
      : `Hi ${userProfile.name}! It is so great to meet you. I am ${partner.name}. What would you like to talk about today?`;

    conversationHistoryRef.current.push({
      id: 'msg-0',
      sender: 'ai',
      text: initialGreeting,
      timestamp: new Date().toISOString(),
    });

    partnerSpeak(initialGreeting, partner);
  };

  const partnerSpeak = (text: string, partner: PartnerAvatar = selectedPartner) => {
    setEmotion('speaking');
    streamPartnerSubtitle(text);

    const isGerman = userProfile.learningLanguage.toLowerCase().includes('german');

    speechService.speak(text, {
      lang: isGerman ? 'de-DE' : 'en-US',
      gender: partner.voiceGender,
      style: partner.voiceStyle,
      rate: 1.0,
      pitch: partner.voiceGender === 'Female' ? 1.15 : 0.9,
      onEnd: () => {
        if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
        setPartnerSubtitle(text);
        setEmotion('listening');
        startListeningToUser();
      },
      onError: () => {
        if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
        setPartnerSubtitle(text);
        setEmotion('listening');
        startListeningToUser();
      },
    });
  };

  const startListeningToUser = () => {
    if (isMuted) return;
    setEmotion('listening');

    const isGerman = userProfile.learningLanguage.toLowerCase().includes('german');

    speechService.startListening({
      lang: isGerman ? 'de-DE' : 'en-US',
      onResult: (transcript) => {
        setUserLiveSubtitle(transcript);

        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

        // When user pauses speaking (1.5s), send to Gemini AI
        silenceTimeoutRef.current = setTimeout(() => {
          if (transcript.trim().length > 1) {
            handleUserSpeechFinished(transcript);
          }
        }, 1500);
      },
      onError: () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      },
      onEnd: () => {
        // Keep listening loop if call is ongoing
      },
    });
  };

  const handleUserSpeechFinished = async (spokenText: string) => {
    speechService.stopListening();
    setEmotion('thinking');

    conversationHistoryRef.current.push({
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: spokenText,
      timestamp: new Date().toISOString(),
    });

    try {
      const response = await aiProvider.generateConversation({
        language: userProfile.learningLanguage,
        cefrLevel: userProfile.currentLevel || 'B1',
        topic: 'General Topic',
        mode: selectedPartner.voiceStyle,
        history: conversationHistoryRef.current,
        userMessage: spokenText,
        partner: {
          name: selectedPartner.name,
          voiceGender: selectedPartner.voiceGender,
          voiceStyle: selectedPartner.voiceStyle,
          personality: selectedPartner.personality,
        },
        userProfile: {
          name: userProfile.name,
          currentLevel: userProfile.currentLevel,
          learningLanguage: userProfile.learningLanguage,
        },
      });

      conversationHistoryRef.current.push({
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: response.aiReply,
        timestamp: new Date().toISOString(),
      });

      setUserLiveSubtitle('');
      partnerSpeak(response.aiReply);
    } catch {
      setEmotion('idle');
      startListeningToUser();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListeningToUser();
    } else {
      setIsMuted(true);
      speechService.stopListening();
      setEmotion('idle');
    }
  };

  const endCall = () => {
    speechService.stopSpeech();
    speechService.stopListening();
    if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);

    setIsFullScreenCall(false);
    setEmotion('idle');
    setPartnerSubtitle('');
    setUserLiveSubtitle('');
    conversationHistoryRef.current = [];
  };

  // FULLSCREEN IMMERSIVE CALL VIEW
  if (isFullScreenCall) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-zinc-950 p-4 sm:p-10 text-white min-h-screen select-none overflow-hidden">
        {/* Top bar: Only Partner Name & Live Ping */}
        <div className="flex items-center justify-between max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white">{selectedPartner.name}</span>
          </div>
        </div>

        {/* Center: Large Clean Partner Avatar Visual & Subtitles */}
        <div className="flex flex-1 flex-col items-center justify-center my-auto space-y-6 max-w-2xl mx-auto w-full">
          <div className="relative">
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                emotion === 'speaking'
                  ? 'bg-indigo-500/35 scale-125'
                  : emotion === 'listening'
                  ? 'bg-emerald-500/30 scale-110'
                  : emotion === 'thinking'
                  ? 'bg-amber-500/30 scale-105'
                  : 'bg-indigo-600/15 scale-95'
              }`}
            />

            {/* Circular Portrait */}
            <div
              className={`relative h-56 w-56 sm:h-72 sm:w-72 overflow-hidden rounded-full border-4 shadow-2xl transition-all duration-500 ${
                emotion === 'speaking'
                  ? 'border-indigo-500 ring-8 ring-indigo-500/40 scale-105'
                  : emotion === 'listening'
                  ? 'border-emerald-500 ring-8 ring-emerald-500/30'
                  : emotion === 'thinking'
                  ? 'border-amber-500 ring-6 ring-amber-500/30 animate-pulse'
                  : 'border-zinc-800 ring-4 ring-zinc-900'
              }`}
            >
              <img
                src={selectedPartner.avatarUrl}
                alt={selectedPartner.name}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>

          {/* Subtitles Box */}
          <div className="w-full text-center space-y-2.5 px-3">
            {partnerSubtitle && (
              <div className="rounded-2xl sm:rounded-3xl border border-zinc-800/80 bg-zinc-900/90 p-4 sm:p-5 backdrop-blur-md shadow-2xl transition-all">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  {selectedPartner.name}:
                </span>
                <p className="text-base sm:text-xl font-semibold text-white leading-relaxed">
                  "{partnerSubtitle}"
                </p>
              </div>
            )}

            {userLiveSubtitle && (
              <div className="rounded-xl sm:rounded-2xl border border-emerald-900/40 bg-emerald-950/50 px-3.5 py-2 text-xs sm:text-sm text-emerald-300 backdrop-blur-md">
                <span className="font-bold">{t.speakingYou} </span>"{userLiveSubtitle}"
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-center gap-5 pb-2 sm:pb-4">
          <button
            onClick={toggleMute}
            className={`flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full font-bold shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
              isMuted
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-indigo-600/40'
            }`}
            title={isMuted ? t.unmuteMic : t.muteMic}
          >
            {isMuted ? <MicOff className="h-6 w-6 sm:h-7 sm:w-7" /> : <Mic className="h-6 w-6 sm:h-7 sm:w-7" />}
          </button>

          <button
            onClick={endCall}
            className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95 cursor-pointer"
            title={t.endCall}
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn pb-4 max-w-4xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {t.speakingHeading}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-md mx-auto">
          {t.speakingSubheading}
        </p>
      </div>

      {/* Speaker Cards: Photo, Name, and Speak button ONLY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        {PARTNER_AVATARS.map((partner) => (
          <div
            key={partner.id}
            onClick={() => startVoiceCall(partner)}
            className="cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between hover:shadow-md transition-all active:scale-[0.99]"
          >
            <div>
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={partner.avatarUrl}
                  alt={partner.name}
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Name Only */}
              <div className="mt-3 text-left">
                <h3 className="text-lg sm:text-xl font-black text-zinc-900 dark:text-white">
                  {partner.name}
                </h3>
              </div>
            </div>

            {/* Speak Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                startVoiceCall(partner);
              }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-colors active:scale-98 cursor-pointer"
            >
              <Mic className="h-4 w-4" />
              <span>{t.speakWith(partner.name)}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
