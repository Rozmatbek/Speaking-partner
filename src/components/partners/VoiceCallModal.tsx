'use client';

import React, { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  CameraOff,
  Hand,
  Lightbulb,
  Mic,
  MicOff,
  PhoneOff,
  Shield,
  ShieldAlert,
  UserCheck,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { ReportModal } from './ReportModal';

export const VoiceCallModal: React.FC = () => {
  const {
    activeVoiceCall,
    endVoiceCall,
    toggleCallMute,
    toggleCallDeafen,
    blockUser,
    submitReport,
    userProfile,
  } = useApp();

  const [callDuration, setCallDuration] = useState<number>(0);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [activeIcebreakerIndex, setActiveIcebreakerIndex] = useState<number>(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeVoiceCall && activeVoiceCall.isConnected) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeVoiceCall]);

  if (!activeVoiceCall) return null;

  const partner = activeVoiceCall.partner;

  const icebreakers = [
    `"What is your favorite local food in your hometown?"`,
    `"Why are you preparing to learn ${partner.learningLanguage}?"`,
    `"If you could travel anywhere in the world tomorrow, where would you go and why?"`,
    `"How do you prefer to spend your free time on weekends?"`,
  ];

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  const handleReportSubmit = (reason: any, details: string, alsoBlock: boolean) => {
    submitReport(partner.id, partner.name, reason, details);
    if (alsoBlock) {
      blockUser(partner.id);
    }
    setIsReportModalOpen(false);
    endVoiceCall();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-950 text-white shadow-2xl">
        
        {/* Call Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-3 w-3 rounded-full bg-emerald-500 animate-ping" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white sm:text-base">
                  Voice Exchange with {partner.name}
                </h3>
                <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800">
                  Real User Voice 🎙️
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Peer Mode: Voice Only · Camera Disabled for Privacy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-zinc-900 px-3 py-1 font-mono text-xs font-bold text-emerald-400 border border-zinc-800">
              {activeVoiceCall.isConnecting ? 'Connecting WebRTC...' : formatTimer(callDuration)}
            </span>
          </div>
        </div>

        {/* Center Avatars & Real-time Sound Wave Simulation */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            
            {/* You */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-sky-400 text-xl font-bold shadow-lg">
                {userProfile.name.charAt(0).toUpperCase()}
                {!activeVoiceCall.isMuted && (
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                    <Mic className="h-3.5 w-3.5" />
                  </div>
                )}
                {activeVoiceCall.isMuted && (
                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-white">
                    <MicOff className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>
              <h4 className="mt-3 text-sm font-bold text-zinc-200">You ({userProfile.name})</h4>
              <span className="text-[11px] text-zinc-400">Speaking {partner.learningLanguage}</span>
            </div>

            {/* Speaking Partner */}
            <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-zinc-800 border-2 border-emerald-500/80 text-xl font-bold overflow-hidden shadow-lg">
                <img
                  src={partner.avatarUrl}
                  alt={partner.name}
                  className="h-full w-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">
                  <Volume2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <h4 className="mt-3 text-sm font-bold text-zinc-200">{partner.name}</h4>
              <span className="text-[11px] text-zinc-400">Native {partner.nativeLanguage} ({partner.country})</span>
            </div>
          </div>

          {/* Real Human Soundwave Indicator */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-zinc-800/80 bg-black/40 p-4">
            <div className="flex items-center gap-1 h-8">
              {[40, 80, 60, 95, 30, 75, 85, 50, 90, 70, 60, 40].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1 rounded-full bg-emerald-400 animate-pulse"
                  style={{
                    height: activeVoiceCall.isMuted ? '20%' : `${h}%`,
                    animationDelay: `${idx * 0.1}s`,
                  }}
                />
              ))}
            </div>
            <span className="mt-2 text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
              Live Encrypted Peer-to-Peer Voice Stream
            </span>
          </div>

          {/* Icebreaker Card */}
          <div className="rounded-2xl border border-indigo-900/40 bg-indigo-950/30 p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Lightbulb className="h-4 w-4 text-amber-400" />
                Conversation Icebreaker
              </span>
              <button
                onClick={() =>
                  setActiveIcebreakerIndex((prev) => (prev + 1) % icebreakers.length)
                }
                className="text-[10px] font-bold text-indigo-400 hover:underline"
              >
                Next Topic 💡
              </button>
            </div>
            <p className="mt-2 text-sm italic text-indigo-200">
              {icebreakers[activeIcebreakerIndex]}
            </p>
          </div>
        </div>

        {/* Call Action Bar: Mute, Deafen, Safety Report, End Call */}
        <div className="flex items-center justify-between border-t border-zinc-800 bg-zinc-900/90 px-6 py-4">
          <div className="flex items-center gap-2">
            {/* Mute Mic */}
            <button
              onClick={toggleCallMute}
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold transition-colors ${
                activeVoiceCall.isMuted
                  ? 'bg-rose-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
              title={activeVoiceCall.isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {activeVoiceCall.isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </button>

            {/* Deafen Audio */}
            <button
              onClick={toggleCallDeafen}
              className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold transition-colors ${
                activeVoiceCall.isDeafened
                  ? 'bg-amber-600 text-white'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
              title={activeVoiceCall.isDeafened ? 'Undeafen audio' : 'Deafen partner audio'}
            >
              {activeVoiceCall.isDeafened ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
            </button>

            {/* Camera is always OFF by default */}
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-60"
              title="Camera is off by default for privacy protection."
            >
              <CameraOff className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Report & Block User */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 px-3.5 py-2 text-xs font-bold text-rose-300 hover:bg-rose-900/40 transition-colors"
            >
              <ShieldAlert className="h-4 w-4" />
              <span className="hidden sm:inline">Report / Block</span>
            </button>

            {/* End Call */}
            <button
              onClick={endVoiceCall}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 shadow-md shadow-rose-600/30 transition-all active:scale-95"
            >
              <PhoneOff className="h-4 w-4" />
              <span>Leave Call</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Report Modal */}
      <ReportModal
        partner={partner}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
};
