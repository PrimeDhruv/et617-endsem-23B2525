import React, { useState } from 'react';
import { FeedbackItem, Team } from '../types';
import { TEACHER_OVERRIDE_PRESETS } from '../data/content';
import { BigButton } from './BigButton';

interface TeacherQueueItemProps {
  item: FeedbackItem;
  team?: Team | null;
  onApprove: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onOverride: (id: string, overrideText: string) => void;
}

export const TeacherQueueItem: React.FC<TeacherQueueItemProps> = ({
  item,
  team,
  onApprove,
  onEdit,
  onOverride,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.aiFeedback);

  const [isOverriding, setIsOverriding] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(TEACHER_OVERRIDE_PRESETS[0]);
  const [customOverrideText, setCustomOverrideText] = useState('');

  const misconceptionLabels = {
    M1: 'M1: "Hotter is always better"',
    M2: 'M2: "Plants make food in dark / soil"',
    none: 'None detected',
  };

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    onEdit(item.id, editText.trim());
    setIsEditing(false);
  };

  const handleSaveOverride = () => {
    const finalOverride =
      customOverrideText.trim() ? customOverrideText.trim() : selectedPreset;
    onOverride(item.id, finalOverride);
    setIsOverriding(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm space-y-4 transition-all">
      {/* Item Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{team?.avatar || '👥'}</span>
          <div>
            <div className="font-black text-xl text-gray-900 flex items-center gap-2">
              <span>{team?.name || 'Student Team'}</span>
              <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {team?.level || 'sapling'}
              </span>
            </div>
            <span className="text-xs text-gray-500 font-semibold">
              Submitted {new Date(item.createdAt).toLocaleTimeString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Misconception Tag */}
          {item.misconception !== 'none' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-alert-soft text-alert-dark border border-alert-light">
              <span>⚠️</span>
              <span>{misconceptionLabels[item.misconception]}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-800 border border-green-200">
              <span>✓ Concept Valid</span>
            </span>
          )}

          {/* AI or Offline Source Badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black border ${
              item.source === 'ai'
                ? 'bg-purple-100 text-purple-900 border-purple-300'
                : 'bg-gray-100 text-gray-800 border-gray-300'
            }`}
          >
            <span>{item.source === 'ai' ? '🤖 Gemini AI' : '📴 Offline Rules'}</span>
          </span>
        </div>
      </div>

      {/* Child Answer Context */}
      <div className="space-y-1.5 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-sm sm:text-base">
        <div className="text-xs font-bold uppercase text-gray-500">
          Question: {item.question}
        </div>
        <div className="font-bold text-gray-900 text-base sm:text-lg">
          Child's Answer: <span className="text-plant-dark">"{item.answer}"</span>
        </div>
      </div>

      {/* Suggested Feedback View or Inline Forms */}
      {!isEditing && !isOverriding ? (
        <div className="space-y-3">
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
            <span className="text-xs font-black uppercase text-amber-900 tracking-wide block">
              Suggested Feedback to Learner:
            </span>
            <p className="text-lg font-bold text-gray-900 leading-relaxed">
              "{item.aiFeedback}"
            </p>
            {item.nextHint && (
              <div className="text-sm font-semibold text-gray-600 pt-1">
                Next Hint: {item.nextHint}
              </div>
            )}
          </div>

          {/* Action Buttons: Approve, Edit, Override */}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsOverriding(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-blue-300 bg-blue-50 text-blue-900 font-bold hover:bg-blue-100 text-base transition-colors"
            >
              🔁 Override
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-amber-400 bg-amber-100 text-amber-950 font-bold hover:bg-amber-200 text-base transition-colors"
            >
              ✏️ Edit
            </button>

            <BigButton
              type="button"
              onClick={() => onApprove(item.id)}
              variant="primary"
              size="normal"
              className="text-base py-2 px-5 min-h-[44px]"
              icon="✅"
            >
              Approve Feedback
            </BigButton>
          </div>
        </div>
      ) : isEditing ? (
        /* Edit Mode */
        <div className="space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-300">
          <label className="block text-sm font-black text-amber-950">
            Edit Feedback Text before sending:
          </label>
          <textarea
            rows={3}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-amber-400 text-base font-bold text-gray-900 bg-white"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="min-h-[40px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-white text-sm"
            >
              Cancel
            </button>
            <BigButton
              type="button"
              onClick={handleSaveEdit}
              variant="primary"
              size="normal"
              className="text-sm py-2 px-4 min-h-[40px]"
            >
              Save & Send ✓
            </BigButton>
          </div>
        </div>
      ) : (
        /* Override Mode */
        <div className="space-y-3 p-4 bg-blue-50 rounded-xl border border-blue-300">
          <label className="block text-sm font-black text-blue-950">
            Select a Teacher Pedagogical Preset:
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full p-3 rounded-lg border-2 border-blue-400 bg-white text-base font-semibold text-gray-900"
          >
            {TEACHER_OVERRIDE_PRESETS.map((preset, idx) => (
              <option key={idx} value={preset}>
                {preset}
              </option>
            ))}
          </select>

          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-600">
              Or write custom teacher guidance (overrides dropdown if filled):
            </span>
            <input
              type="text"
              value={customOverrideText}
              onChange={(e) => setCustomOverrideText(e.target.value)}
              placeholder="Custom teacher message…"
              className="w-full p-3 rounded-lg border-2 border-blue-300 bg-white text-base text-gray-900"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsOverriding(false)}
              className="min-h-[40px] px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-white text-sm"
            >
              Cancel
            </button>
            <BigButton
              type="button"
              onClick={handleSaveOverride}
              variant="secondary"
              size="normal"
              className="text-sm py-2 px-4 min-h-[40px]"
            >
              Apply Override ➔
            </BigButton>
          </div>
        </div>
      )}
    </div>
  );
};
