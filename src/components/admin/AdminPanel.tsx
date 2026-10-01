'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  FileCheck2,
  Globe2,
  Headphones,
  Mic,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    reports,
    partners,
    blockedUserIds,
    languages,
    mockExams,
    shadowingLessons,
    showToast,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'metrics' | 'reports' | 'users' | 'catalog'>(
    'metrics'
  );

  const metrics = {
    totalUsers: 1420,
    activeToday: 318,
    aiSessions: 4890,
    humanVoiceCalls: 1240,
    mockExamsTaken: 890,
    pendingReports: reports.filter((r) => r.status === 'Pending Review').length,
    safetyIncidentsResolved: 14,
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Platform Administration
          </span>
          <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold text-rose-800 dark:bg-rose-950 dark:text-rose-300">
            Safety & Moderation Control
          </span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-3xl">
          Admin & Trust Center
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          Review community safety reports, monitor real-time AI and human session metrics, and manage content catalogs.
        </p>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 pb-2 dark:border-zinc-800">
        {[
          { id: 'metrics', label: 'Platform Analytics' },
          { id: 'reports', label: `Safety Reports (${metrics.pendingReports})` },
          { id: 'users', label: 'Learner Directory & Safety' },
          { id: 'catalog', label: 'Content & Languages Catalog' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeAdminTab === tab.id
                ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-950'
                : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Platform Analytics */}
      {activeAdminTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs text-zinc-500 font-medium">Total Registered</span>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {metrics.totalUsers}
              </div>
              <span className="text-[11px] text-emerald-600 font-semibold">+14% month</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs text-zinc-500 font-medium">Active Today</span>
              <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                {metrics.activeToday}
              </div>
              <span className="text-[11px] text-zinc-400">Live peak</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs text-zinc-500 font-medium">AI Sessions</span>
              <div className="text-2xl font-extrabold text-zinc-900 dark:text-white mt-1">
                {metrics.aiSessions}
              </div>
              <span className="text-[11px] text-zinc-400">TTS & STT</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-xs text-zinc-500 font-medium">Human Voice Calls</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                {metrics.humanVoiceCalls}
              </div>
              <span className="text-[11px] text-zinc-400">WebRTC P2P</span>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Safety & Moderation SLA Health
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900">
                <span className="font-bold text-emerald-900 dark:text-emerald-200">
                  Zero Minor Policy Breaches
                </span>
                <p className="mt-1 text-emerald-700 dark:text-emerald-300">
                  Strict age categories (Under 16 / 16–17 / 18+) isolated automatically.
                </p>
              </div>

              <div className="rounded-2xl bg-indigo-50 p-4 border border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-900">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">
                  Average Report SLA: &lt; 2h
                </span>
                <p className="mt-1 text-indigo-700 dark:text-indigo-300">
                  All flagged calls reviewed with transcript audit trail.
                </p>
              </div>

              <div className="rounded-2xl bg-sky-50 p-4 border border-sky-200 dark:bg-sky-950/40 dark:border-sky-900">
                <span className="font-bold text-sky-900 dark:text-sky-200">
                  Voice-Only Enforced
                </span>
                <p className="mt-1 text-sky-700 dark:text-sky-300">
                  No video permissions required for human-to-human practice.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Safety Reports Queue */}
      {activeAdminTab === 'reports' && (
        <div className="space-y-4">
          {reports.length > 0 ? (
            reports.map((r) => (
              <div
                key={r.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/50 p-4 text-xs dark:border-rose-900/40 dark:bg-rose-950/20 gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-200 px-2 py-0.5 font-bold text-rose-900 dark:bg-rose-900 dark:text-rose-200">
                      {r.reason}
                    </span>
                    <span className="text-zinc-500">Reported User: <strong>{r.reportedPartnerName}</strong></span>
                  </div>
                  <p className="mt-1.5 text-zinc-700 dark:text-zinc-300">
                    "{r.details || 'No additional text provided.'}"
                  </p>
                  <span className="text-[10px] text-zinc-400 mt-1 block">
                    Submitted: {new Date(r.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast(`Report ${r.id} marked as Resolved.`, 'success')}
                    className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3 py-1.5 font-bold text-white hover:bg-emerald-700"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Dismiss / Resolve</span>
                  </button>
                  <button
                    onClick={() => showToast(`User ${r.reportedPartnerName} permanently suspended.`, 'warning')}
                    className="flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 font-bold text-white hover:bg-rose-700"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Ban User</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-500 dark:border-zinc-800">
              <ShieldCheck className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
              <p className="font-bold text-zinc-800 dark:text-zinc-200">No Pending Safety Reports</p>
              <p className="text-zinc-400 mt-0.5">The community is clean and compliant.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Users & Safe Groups */}
      {activeAdminTab === 'users' && (
        <div className="space-y-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-3">
              Verified Speaking Learners
            </h3>
            <div className="space-y-2">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50/70 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-850"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.avatarUrl}
                      alt={p.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-zinc-900 dark:text-white">
                        {p.name} {p.flag}
                      </div>
                      <span className="text-[11px] text-zinc-500">
                        {p.nativeLanguage} → {p.learningLanguage}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {p.ageCategory}
                    </span>
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Content & Languages Catalog */}
      {activeAdminTab === 'catalog' && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
              Language Catalog Status
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {languages.map((l) => (
                <div
                  key={l.code}
                  className="rounded-xl border border-zinc-200 p-3 text-xs flex items-center justify-between dark:border-zinc-800"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{l.flagEmoji}</span>
                    <span className="font-bold text-zinc-900 dark:text-white">{l.name}</span>
                  </div>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      l.isAvailable
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800'
                    }`}
                  >
                    {l.isAvailable ? 'Active' : 'Architecture Ready'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
