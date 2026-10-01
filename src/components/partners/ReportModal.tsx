'use client';

import React, { useState } from 'react';
import { HumanPartner, ReportReason } from '@/types';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

interface ReportModalProps {
  partner: HumanPartner;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, details: string, alsoBlock: boolean) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  partner,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState<ReportReason>('Inappropriate behavior');
  const [details, setDetails] = useState<string>('');
  const [alsoBlock, setAlsoBlock] = useState<boolean>(true);

  if (!isOpen) return null;

  const reportReasons: ReportReason[] = [
    'Inappropriate behavior',
    'Harassment',
    'Spam',
    'Unsafe communication',
    'Other',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-rose-600">
            <ShieldAlert className="h-5 w-5" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Report User ({partner.name})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-xs">
          <p className="text-zinc-500 dark:text-zinc-400">
            We prioritize community safety, especially for young learners. Reports are investigated within 24 hours by our human moderation team.
          </p>

          <div>
            <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Select Reason:
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            >
              {reportReasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 dark:text-zinc-300 mb-1">
              Additional Details (Optional):
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Describe what occurred during the interaction..."
              className="w-full rounded-xl border border-zinc-300 bg-zinc-50 p-2.5 text-zinc-900 placeholder:text-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={alsoBlock}
              onChange={(e) => setAlsoBlock(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-rose-600 focus:ring-rose-500"
            />
            <span className="font-semibold text-zinc-800 dark:text-zinc-200">
              Also block {partner.name} immediately
            </span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason, details, alsoBlock)}
            className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700 shadow-sm"
          >
            Submit Report & Protect Safety
          </button>
        </div>
      </div>
    </div>
  );
};
