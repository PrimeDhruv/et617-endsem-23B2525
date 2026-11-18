import React from 'react';
import { FeedbackItem } from '../types';

interface FeedbackCardProps {
  item?: FeedbackItem | null;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ item }) => {
  if (!item) return null;

  const isPending = item.status === 'pending';
  const isOverridden = item.status === 'overridden';

  return (
    <div
      aria-live="polite"
      className={`p-5 sm:p-6 rounded-2xl border-2 transition-all ${
        isPending
          ? 'bg-amber-50/70 border-amber-300'
          : 'bg-green-50/80 border-green-500 shadow-sm'
      }`}
    >
      {/* Pending State */}
      {isPending ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-spin">⏳</span>
            <div>
              <h4 className="text-xl sm:text-2xl font-black text-amber-950">
                Your teacher is checking your answer…
              </h4>
              <p className="text-sm font-semibold text-amber-800">
                Great science work! Your teacher will review and approve your feedback in a moment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 text-xs font-bold text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
            <span>Live waiting for teacher review (auto-refreshes)</span>
            {item.source === 'offline' && (
              <span className="ml-auto inline-flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">
                <span>📴</span>
                <span>Offline Engine</span>
              </span>
            )}
          </div>
        </div>
      ) : (
        /* Approved / Edited / Overridden State */
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-plant text-white shadow-sm">
              <span>👩‍🏫</span>
              <span>Checked by teacher</span>
            </span>

            <div className="flex items-center gap-2">
              {item.source === 'offline' && (
                <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-0.5 rounded-full">
                  📴 Offline feedback
                </span>
              )}
              {isOverridden && (
                <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                  Teacher Guide Note
                </span>
              )}
            </div>
          </div>

          {/* Feedback Text Display */}
          <div className="p-4 bg-white rounded-xl border border-green-300 space-y-2">
            <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed">
              💬 "{item.finalText || item.aiFeedback}"
            </p>
            {item.nextHint && (
              <div className="pt-2 border-t border-gray-100 text-sm font-semibold text-plant-dark">
                💡 <strong>Next Experiment Hint:</strong> {item.nextHint}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
