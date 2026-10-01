'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { speechService } from '@/lib/speech';
import { aiProvider } from '@/lib/ai-provider';
import {
  Mic,
  MicOff,
  PhoneOff,
  Smile,
  Sparkles,
  Volume2,
} from 'lucide-react';

interface PartnerAvatar {
  id: string;
  name: string;
  avatarUrl: string;
  genderText: string;
  country: string;
  flag: string;
  language: string;
  nativeAccent: string;
  voiceGender: 'Female' | 'Male';
  voiceStyle: 'Friendly' | 'Professional' | 'Calm' | 'Energetic';
  personality: string;
}

// Exactly 1 Female and 1 Male Partner as requested
const PARTNER_AVATARS: PartnerAvatar[] = [
  {
    id: 'p-emma',
    name: 'Emma',
    genderText: 'Ayol Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80',
    country: 'United Kingdom',
    flag: '🇬🇧',
    language: 'English',
    nativeAccent: 'British (London)',
    voiceGender: 'Female',
    voiceStyle: 'Friendly',
    personality: 'Samimiy, tushunarli va ravon so‘zlashuvchi ingliz tili sohibasi',
  },
  {
    id: 'p-lucas',
    name: 'Lucas',
    genderText: 'Erkak Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80',
    country: 'Germany / UK',
    flag: '🇩🇪',
    language: 'German & English',
    nativeAccent: 'Standard Deutsch / European English',
    voiceGender: 'Male',
    voiceStyle: 'Calm',
    personality: 'Bosiq, qiziqarli va tabiiy muloqot qiluvchi suhbatdosh',
  },
];

type EmotionState = 'idle' | 'listening' | 'thinking' | 'speaking';

export const AiSpeakingSession: React.FC = () => {
  const { userProfile, showToast } = useApp();

  const [selectedPartner, setSelectedPartner] = useState<PartnerAvatar>(PARTNER_AVATARS[0]);
  const [isFullScreenCall, setIsFullScreenCall] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<EmotionState>('idle');

  // Subtitles & Dialogue State
  const [partnerSubtitle, setPartnerSubtitle] = useState<string>('');
  const [userLiveSubtitle, setUserLiveSubtitle] = useState<string>('');

  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typewriterIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const streamPartnerSubtitle = (fullText: string) => {
    if (typewriterIntervalRef.current) clearInterval(typewriterIntervalRef.current);
    const words = fullText.split(' ');
    let currentIdx = 0;
    setPartnerSubtitle('');

    // Natural streaming interval per word roughly synchronizing with natural speech
    const intervalMs = Math.max(140, Math.min(260, Math.floor(4000 / Math.max(words.length, 1))));

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

    const isGerman = userProfile.learningLanguage.toLowerCase().includes('german');
    const initialGreeting = isGerman
      ? `Hallo ${userProfile.name}! Schön dich kennenzulernen. Ich bin ${partner.name}. Worüber möchtest du heute sprechen?`
      : `Hi ${userProfile.name}! It is so great to meet you. I am ${partner.name}. What would you like to talk about today?`;

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
      onResult: (transcript, isFinal) => {
        setUserLiveSubtitle(transcript);

        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);

        // When user finishes spoken phrase (1.5s pause), trigger partner response
        silenceTimeoutRef.current = setTimeout(() => {
          if (transcript.trim().length > 2) {
            handleUserSpeechFinished(transcript);
          }
        }, 1500);
      },
      onError: () => {
        if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
      },
      onEnd: () => {
        // Keep listening loop if still active
      },
    });
  };

  const handleUserSpeechFinished = async (spokenText: string) => {
    speechService.stopListening();
    setEmotion('thinking');

    try {
      const response = await aiProvider.generateConversation({
        language: userProfile.learningLanguage,
        cefrLevel: userProfile.currentLevel || 'B1',
        topic: 'Spontaneous Voice Dialogue',
        mode: selectedPartner.voiceStyle,
        history: [],
        userMessage: spokenText,
      });

      setUserLiveSubtitle('');
      partnerSpeak(response.aiReply);
    } catch (err) {
      setEmotion('idle');
      startListeningToUser();
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      startListeningToUser();
      showToast('Microphone unmuted', 'info');
    } else {
      setIsMuted(true);
      speechService.stopListening();
      setEmotion('idle');
      showToast('Microphone muted', 'info');
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
  };

  // FULLSCREEN IMMERSIVE CALL VIEW
  if (isFullScreenCall) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-between bg-zinc-950 p-6 sm:p-10 text-white min-h-screen select-none">
        {/* Top bar: Only Partner Name */}
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">{selectedPartner.name}</span>
          </div>
        </div>

        {/* Center: Large Real Partner Photo & Subtitles */}
        <div className="flex flex-1 flex-col items-center justify-center my-auto space-y-8 max-w-3xl mx-auto w-full">
          {/* Big Expressive Partner Avatar Visual with Emotional Glow */}
          <div className="relative">
            {/* Dynamic Glow Aura */}
            <div
              className={`absolute inset-0 rounded-full blur-3xl transition-all duration-700 ${
                emotion === 'speaking'
                  ? 'bg-indigo-500/40 scale-125'
                  : emotion === 'listening'
                  ? 'bg-emerald-500/35 scale-110'
                  : emotion === 'thinking'
                  ? 'bg-amber-500/30 scale-105'
                  : 'bg-indigo-600/20 scale-95'
              }`}
            />

            {/* High Definition Large Photo Frame */}
            <div
              className={`relative h-64 w-64 sm:h-80 sm:w-80 overflow-hidden rounded-full border-4 shadow-2xl transition-all duration-500 ${
                emotion === 'speaking'
                  ? 'border-indigo-500 ring-8 ring-indigo-500/40 scale-105'
                  : emotion === 'listening'
                  ? 'border-emerald-500 ring-8 ring-emerald-500/30'
                  : emotion === 'thinking'
                  ? 'border-amber-500 ring-6 ring-amber-500/30 animate-pulse'
                  : 'border-zinc-700 ring-4 ring-zinc-800'
              }`}
            >
              <img
                src={selectedPartner.avatarUrl}
                alt={selectedPartner.name}
                className="h-full w-full object-cover object-top"
              />
            </div>

            {/* Status Pill Badge */}
            <div
              className={`absolute -bottom-2 right-6 flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold text-white shadow-2xl backdrop-blur-md transition-all ${
                emotion === 'speaking'
                  ? 'bg-indigo-600'
                  : emotion === 'listening'
                  ? 'bg-emerald-600'
                  : emotion === 'thinking'
                  ? 'bg-amber-600'
                  : 'bg-zinc-800'
              }`}
            >
              {emotion === 'speaking' && <Volume2 className="h-3.5 w-3.5 animate-bounce" />}
              {emotion === 'listening' && <Mic className="h-3.5 w-3.5 animate-pulse" />}
              {emotion === 'thinking' && <Sparkles className="h-3.5 w-3.5 animate-spin" />}
              {emotion === 'idle' && <Smile className="h-3.5 w-3.5" />}
              <span className="capitalize">{emotion}</span>
            </div>
          </div>

          {/* Natural Soundwave Line */}
          <div className="flex items-center justify-center gap-1.5 h-8">
            {[35, 70, 95, 50, 85, 100, 75, 90, 40, 65, 80, 55, 30].map(
              (val, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 rounded-full transition-all duration-150 ${
                    emotion === 'speaking'
                      ? 'bg-indigo-400'
                      : emotion === 'listening'
                      ? 'bg-emerald-400'
                      : 'bg-zinc-800'
                  }`}
                  style={{
                    height:
                      emotion === 'speaking' || emotion === 'listening'
                        ? `${(val * Math.random()) + 25}%`
                        : '20%',
                  }}
                />
              )
            )}
          </div>

          {/* CLEAR READABLE SUBTITLES BAR */}
          <div className="w-full text-center space-y-2 px-4">
            {partnerSubtitle && (
              <div className="rounded-3xl border border-zinc-800/80 bg-zinc-900/80 p-5 backdrop-blur-md shadow-xl transition-all">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 block mb-1">
                  {selectedPartner.name}:
                </span>
                <p className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                  "{partnerSubtitle}"
                </p>
              </div>
            )}

            {userLiveSubtitle && (
              <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/40 px-4 py-2.5 text-xs sm:text-sm text-emerald-300 backdrop-blur-md">
                <span className="font-bold">You: </span>"{userLiveSubtitle}"
              </div>
            )}
          </div>
        </div>

        {/* Bottom Control Bar: Big Microphone Button + Smaller Red End Button */}
        <div className="flex items-center justify-center gap-6 pb-2">
          {/* Main Microphone Button */}
          <button
            onClick={toggleMute}
            className={`flex h-16 w-16 items-center justify-center rounded-3xl font-bold shadow-2xl transition-all transform active:scale-95 cursor-pointer ${
              isMuted
                ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                : 'bg-gradient-to-tr from-indigo-600 to-sky-500 text-white shadow-indigo-600/40'
            }`}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
          >
            {isMuted ? <MicOff className="h-7 w-7" /> : <Mic className="h-7 w-7" />}
          </button>

          {/* Smaller Red End Call Button */}
          <button
            onClick={endCall}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-600 text-white shadow-lg shadow-rose-600/30 hover:bg-rose-700 transition-all active:scale-95 cursor-pointer"
            title="End conversation"
          >
            <PhoneOff className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn pb-12 max-w-4xl mx-auto">
      {/* Selection screen with 1 Female and 1 Male Partner */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Speaking Partner
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
            Choose a partner for your selected language and practice unlimited speaking without limits.
          </p>
        </div>

        {/* 2 Static Partner Cards: No hover movement/animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {PARTNER_AVATARS.map((partner) => (
            <div
              key={partner.id}
              onClick={() => startVoiceCall(partner)}
              className="cursor-pointer overflow-hidden rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                {/* Large High Definition Photo */}
                <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={partner.avatarUrl}
                    alt={partner.name}
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                {/* Partner Info */}
                <div className="mt-4 text-left">
                  <h3 className="text-xl font-extrabold text-zinc-900 dark:text-white">
                    {partner.name}
                  </h3>
                </div>
              </div>

              {/* Big Start Call Action */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startVoiceCall(partner);
                }}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition-colors active:scale-98 cursor-pointer"
              >
                <Mic className="h-4 w-4" />
                <span>Speak with {partner.name}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
