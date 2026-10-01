'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { HumanPartner, ReportReason } from '@/types';
import {
  AlertTriangle,
  Check,
  Clock,
  Filter,
  Globe2,
  Heart,
  Lock,
  MessageSquare,
  Mic,
  PhoneCall,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import { ReportModal } from './ReportModal';
import { VoiceCallModal } from './VoiceCallModal';

export const HumanPartnersView: React.FC = () => {
  const {
    partners,
    userProfile,
    partnerRequests,
    sendPartnerRequest,
    acceptPartnerRequest,
    startVoiceCall,
    activeVoiceCall,
    blockedUserIds,
    blockUser,
    submitReport,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedInterests, setSelectedInterests] = useState<string>('All');
  const [selectedPartnerForReport, setSelectedPartnerForReport] = useState<HumanPartner | null>(null);

  // Filter partners: exclude blocked users and apply safe age group matching
  const filteredPartners = partners.filter((p) => {
    if (blockedUserIds.includes(p.id)) return false;

    // Safety: If user is under 18, only show peers in safe age categories
    if (userProfile.ageCategory === 'Under 16' && p.ageCategory === '18+') {
      return false;
    }
    if (userProfile.ageCategory === '16–17' && p.ageCategory === 'Under 16') {
      return false; // Age category isolation
    }

    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nativeLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.learningLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.interests.some((i) => i.toLowerCase().includes(searchQuery.toLowerCase()));

    if (selectedInterests !== 'All') {
      return matchesSearch && p.interests.includes(selectedInterests);
    }
    return matchesSearch;
  });

  const getRequestForPartner = (partnerId: string) => {
    return partnerRequests.find((r) => r.receiverId === partnerId);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Safety Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Community Exchange
            </span>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Real Humans · Voice Only
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
            Human Speaking Partners
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Practice conversational reciprocity with verified language learners worldwide.
          </p>
        </div>
      </div>

      {/* Minor Safety & Community Guidelines Banner */}
      <div className="rounded-3xl border border-emerald-200 bg-gradient-to-r from-emerald-50/90 via-teal-50/70 to-emerald-50/90 p-5 dark:border-emerald-900/40 dark:from-emerald-950/40 dark:via-zinc-900 dark:to-emerald-950/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/20">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Safe Peer Exchange Protected ({userProfile.ageCategory} Group)
              </h3>
              <p className="mt-0.5 text-[11px] sm:text-xs text-emerald-800/90 dark:text-emerald-400/90 leading-relaxed">
                Exact ages and personal contacts are strictly hidden. Voice-only mode is active by default. Inappropriate behavior is subject to immediate permanent suspension.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, language (German/English), or interest..."
            className="w-full rounded-2xl border border-zinc-200 bg-white pl-10 pr-4 py-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {['All', 'Software Engineering', 'Travel & Culture', 'Classical Music', 'IELTS/Goethe'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedInterests(cat)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedInterests === cat
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredPartners.map((partner) => {
          const req = getRequestForPartner(partner.id);
          const isPending = req?.status === 'pending';
          const isAccepted = req?.status === 'accepted';

          return (
            <div
              key={partner.id}
              className="flex flex-col justify-between rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 transition-all"
            >
              <div>
                {/* Card Top Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 dark:border-zinc-700">
                      <img
                        src={partner.avatarUrl}
                        alt={partner.name}
                        className="h-full w-full object-cover"
                      />
                      <div
                        className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-zinc-900 ${
                          partner.onlineStatus === 'online'
                            ? 'bg-emerald-500'
                            : partner.onlineStatus === 'busy'
                            ? 'bg-amber-500'
                            : 'bg-zinc-400'
                        }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                          {partner.name}
                        </h3>
                        <span title={partner.country}>{partner.flag}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <span className="rounded bg-zinc-100 px-1.5 py-0.2 font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                          {partner.ageCategory}
                        </span>
                        <span>· {partner.totalSessions} sessions</span>
                      </div>
                    </div>
                  </div>

                  {/* Compatibility Score */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                      <Star className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                      <span>{partner.compatibilityScore}% Match</span>
                    </div>
                  </div>
                </div>

                {/* Language Exchange Badges */}
                <div className="mt-4 rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs space-y-1.5 dark:border-zinc-800 dark:bg-zinc-850/50">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Speaks Native:</span>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {partner.nativeLanguage}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-500">Learning:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {partner.learningLanguage} ({partner.proficiencyLevel})
                    </span>
                  </div>
                </div>

                {/* Bio & Interests */}
                <p className="mt-3 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed line-clamp-2">
                  "{partner.bio}"
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {partner.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Availability */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Available: {partner.availability}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                {isAccepted ? (
                  <button
                    onClick={() => startVoiceCall(partner)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
                  >
                    <PhoneCall className="h-4 w-4" />
                    <span>Start Voice Practice 🎙️</span>
                  </button>
                ) : isPending ? (
                  <button
                    onClick={() => acceptPartnerRequest(req.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 py-2.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300"
                  >
                    <Check className="h-4 w-4" />
                    <span>Accept Request (Demo)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => sendPartnerRequest(partner.id)}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-sm transition-all"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Request Practice</span>
                  </button>
                )}

                {/* Report / Block button */}
                <button
                  onClick={() => setSelectedPartnerForReport(partner)}
                  title="Report or Block User"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-400 hover:border-rose-200 hover:text-rose-600 dark:border-zinc-800 dark:hover:text-rose-400 transition-colors"
                >
                  <Shield className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Safety Report Modal */}
      {selectedPartnerForReport && (
        <ReportModal
          partner={selectedPartnerForReport}
          isOpen={!!selectedPartnerForReport}
          onClose={() => setSelectedPartnerForReport(null)}
          onSubmit={(reason, details, alsoBlock) => {
            submitReport(selectedPartnerForReport.id, selectedPartnerForReport.name, reason, details);
            if (alsoBlock) {
              blockUser(selectedPartnerForReport.id);
            }
            setSelectedPartnerForReport(null);
          }}
        />
      )}

      {/* Live Active Voice Call Room */}
      {activeVoiceCall && <VoiceCallModal />}
    </div>
  );
};
