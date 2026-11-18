import React, { useState } from 'react';
import { useAppState } from '../lib/storage';
import { Level } from '../types';
import { TEACHER_PIN } from '../data/content';
import { TeacherQueueItem } from '../components/TeacherQueueItem';
import { BigButton } from '../components/BigButton';

export const TeacherDashboard: React.FC = () => {
  const {
    state,
    updateFeedbackStatus,
    setClassLevel,
    loadDemo,
    resetAll,
  } = useAppState();

  // PIN gate state (authenticated persisted in session or component state)
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // In-page reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Collapsible Reviewed section
  const [showReviewedList, setShowReviewedList] = useState(false);

  // Compute Header Statistics
  const teams = state.teams || [];
  const totalTrials = teams.reduce((acc, t) => acc + t.trials.length, 0);
  const fairTrials = teams.reduce(
    (acc, t) => acc + t.trials.filter((trial) => trial.fair).length,
    0
  );
  const percentFair = totalTrials > 0 ? Math.round((fairTrials / totalTrials) * 100) : 100;

  const pendingItems = state.feedbackQueue.filter((item) => item.status === 'pending');
  const reviewedItems = state.feedbackQueue.filter((item) => item.status !== 'pending');

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === TEACHER_PIN) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 space-y-6">
        <div className="bg-white p-7 sm:p-8 rounded-2xl border-2 border-gray-200 shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 mx-auto flex items-center justify-center text-3xl">
            👩‍🏫
          </div>
          <h1 className="text-3xl font-black text-gray-900">
            Teacher Dashboard
          </h1>
          <p className="text-gray-600 text-base">
            Constraint <strong>C5 (Teacher-in-the-loop)</strong>: Enter the teacher PIN to monitor teams and review AI feedback.
          </p>

          <form onSubmit={handlePinSubmit} className="space-y-4 pt-2">
            <div>
              <label htmlFor="pin-field" className="block text-sm font-bold text-gray-700 mb-1 text-left">
                Security PIN: <span className="text-plant-dark font-normal">(Demo PIN: <strong>1234</strong>)</span>
              </label>
              <input
                id="pin-field"
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="1234"
                className="w-full text-center text-3xl font-mono tracking-widest min-h-[56px] rounded-xl border-2 border-gray-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {pinError && (
              <p className="text-sm font-bold text-red-600 animate-shake">
                Incorrect PIN. Please enter demo PIN <strong>1234</strong>.
              </p>
            )}

            <BigButton
              type="submit"
              variant="primary"
              size="normal"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              Unlock Dashboard 🔓
            </BigButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-8">
      {/* Top Banner & Header Stats */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-gray-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-amber-100 text-amber-950 border border-amber-300">
              <span>👩‍🏫 Constraint C5</span>
              <span>·</span>
              <span>Teacher-in-the-Loop Orchestration</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
              Teacher Review & Classroom Control
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
              Auto-syncs live (2s poll)
            </span>
          </div>
        </div>

        {/* 4 Key Performance Indicators (KPIs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase block">Active Teams</span>
            <div className="text-3xl font-black text-gray-900">{teams.length}</div>
            <div className="text-xs text-gray-500">Class & tablet groups</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase block">Total Trials Run</span>
            <div className="text-3xl font-black text-water-dark">{totalTrials}</div>
            <div className="text-xs text-gray-500">Virtual experiments</div>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
            <span className="text-xs font-bold text-gray-500 uppercase block">Fair Test Ratio</span>
            <div className="text-3xl font-black text-plant-dark">{percentFair}%</div>
            <div className="text-xs text-gray-500">{fairTrials} of {totalTrials} fair</div>
          </div>

          <div className="p-4 rounded-xl bg-red-50 border border-red-200 space-y-1">
            <span className="text-xs font-bold text-red-700 uppercase block flex items-center justify-between">
              <span>Awaiting Review</span>
              {pendingItems.length > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              )}
            </span>
            <div className="text-3xl font-black text-red-600">{pendingItems.length}</div>
            <div className="text-xs text-red-700 font-semibold">Teacher approval queue</div>
          </div>
        </div>
      </section>

      {/* SECTION A: AI Feedback Queue (C5 Primary Interface) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
              <span>Section A: AI Feedback Review Queue</span>
            </h2>
            {pendingItems.length > 0 ? (
              <span className="bg-red-600 text-white text-xs font-black px-2.5 py-0.5 rounded-full">
                {pendingItems.length} PENDING
              </span>
            ) : (
              <span className="bg-green-100 text-green-800 text-xs font-black px-2.5 py-0.5 rounded-full border border-green-300">
                ALL CAUGHT UP ✓
              </span>
            )}
          </div>
          <span className="text-xs font-semibold text-gray-500">
            No feedback is visible to students until you approve, edit, or override here.
          </span>
        </div>

        {pendingItems.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-gray-200 space-y-2">
            <span className="text-4xl">🎉</span>
            <h3 className="text-xl font-bold text-gray-800">No Pending Student Feedback</h3>
            <p className="text-gray-500 text-base max-w-md mx-auto">
              When students submit their open-ended scientific explanations on the Check screen, their responses appear here for your approval.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingItems.map((item) => {
              const itemTeam = teams.find((t) => t.id === item.teamId);
              return (
                <TeacherQueueItem
                  key={item.id}
                  item={item}
                  team={itemTeam}
                  onApprove={(id) => updateFeedbackStatus(id, 'approved', item.aiFeedback)}
                  onEdit={(id, newText) => updateFeedbackStatus(id, 'edited', newText)}
                  onOverride={(id, overrideText) =>
                    updateFeedbackStatus(id, 'overridden', overrideText)
                  }
                />
              );
            })}
          </div>
        )}

        {/* Collapsible Reviewed History List */}
        {reviewedItems.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
            <button
              type="button"
              onClick={() => setShowReviewedList((prev) => !prev)}
              className="w-full flex items-center justify-between text-left font-black text-lg text-gray-700 hover:text-gray-900"
            >
              <span>
                📁 Reviewed Items History ({reviewedItems.length} item{reviewedItems.length === 1 ? '' : 's'})
              </span>
              <span>{showReviewedList ? '▲ Hide' : '▼ View History'}</span>
            </button>

            {showReviewedList && (
              <div className="space-y-3 pt-2 divide-y divide-gray-100 text-sm">
                {reviewedItems.map((item) => {
                  const itemTeam = teams.find((t) => t.id === item.teamId);
                  return (
                    <div key={item.id} className="pt-3 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          {itemTeam?.avatar} {itemTeam?.name} ({itemTeam?.level})
                        </span>
                        <span
                          className={`text-xs font-black uppercase px-2 py-0.5 rounded-full ${
                            item.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'edited'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-gray-700 italic">
                        Child Answer: "{item.answer}"
                      </p>
                      <p className="text-plant-dark font-semibold">
                        Final Approved Guidance: "{item.finalText || item.aiFeedback}"
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION B: Team Progress Table */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Section B: Team Progress & Formative Learning Metrics
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-base">
            <thead>
              <tr className="bg-gray-100/80 text-gray-700 border-b border-gray-200 text-xs uppercase font-black">
                <th className="py-3 px-3">Team</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3">Trials (Fair/Unfair)</th>
                <th className="py-3 px-3">Active Guess</th>
                <th className="py-3 px-3">Revisions</th>
                <th className="py-3 px-3">Hints Used</th>
                <th className="py-3 px-3">Tasks Score</th>
                <th className="py-3 px-3">Misconceptions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {teams.map((team) => {
                const fairCount = team.trials.filter((t) => t.fair).length;
                const unfairCount = team.trials.length - fairCount;
                const latestHyp = team.hypotheses.length > 0 ? team.hypotheses[team.hypotheses.length - 1] : null;

                // Task answers correct count
                const correctTasksCount = Object.values(team.taskAnswers).filter(
                  (a) => a.correct === true
                ).length;

                return (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-bold text-gray-900 flex items-center gap-1.5">
                      <span>{team.avatar}</span>
                      <span>{team.name}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                        {team.level}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-gray-800">
                      <span>{team.trials.length} total</span>
                      <span className="text-xs text-gray-500 block">
                        ({fairCount} fair, {unfairCount} unfair)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700">
                      {latestHyp ? (
                        <span>
                          {latestHyp.variable} ➔ <strong>{latestHyp.direction}</strong>
                        </span>
                      ) : (
                        <span className="text-gray-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-700 text-center">
                      {Math.max(0, team.hypotheses.length - 1)}
                    </td>
                    <td className="py-3 px-3 font-bold text-gray-700 text-center">
                      {team.hintsUsed}
                    </td>
                    <td className="py-3 px-3 font-black text-plant-dark">
                      {correctTasksCount} / 5
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {team.misconceptionsSeen.includes('M1') && (
                          <span className="text-xs font-black bg-alert-soft text-alert-dark px-2 py-0.5 rounded-full border border-alert-light">
                            M1 (Heat)
                          </span>
                        )}
                        {team.misconceptionsSeen.includes('M2') && (
                          <span className="text-xs font-black bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full border border-blue-200">
                            M2 (Dark)
                          </span>
                        )}
                        {team.misconceptionsSeen.length === 0 && (
                          <span className="text-xs text-gray-400 italic">None</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* SECTION C: Class Controls & Demo Scenarios */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
          Section C: Class Controls & Viva Demonstration Tools
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. Switch Class Mode Level */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
            <span className="text-sm font-bold text-gray-700 block">
              Switch Whole-Class Level:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['seedling', 'sapling', 'tree'] as Level[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setClassLevel(lvl)}
                  className="py-2 px-1 rounded-lg border font-bold text-xs uppercase bg-white hover:bg-gray-100 border-gray-300 text-gray-800"
                >
                  {lvl}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              Switches questions & guidance for Whole Class projector mode.
            </p>
          </div>

          {/* 2. Load Demo Misconception Scenario */}
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 space-y-2">
            <span className="text-sm font-bold text-amber-950 block">
              Load Demo Scenario (Parrots M1):
            </span>
            <BigButton
              type="button"
              onClick={loadDemo}
              variant="accent"
              size="normal"
              className="w-full text-sm py-2 px-3 min-h-[44px] bg-amber-500 hover:bg-amber-600 font-black text-white"
            >
              🦜 Load Demo Scenario
            </BigButton>
            <p className="text-xs text-gray-600">
              Loads Team Parrots (Sapling) with 25°C ➔ 17, 45°C ➔ 5, and pending review item.
            </p>
          </div>

          {/* 3. Reset All Data with in-page modal */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 space-y-2">
            <span className="text-sm font-bold text-red-950 block">
              Reset Application State:
            </span>
            <BigButton
              type="button"
              onClick={() => setShowResetConfirm(true)}
              variant="danger"
              size="normal"
              className="w-full text-sm py-2 px-3 min-h-[44px]"
            >
              ⚠️ Reset All Data
            </BigButton>
            <p className="text-xs text-red-700">
              Clears all trials, teams, and feedback queue back to clean initial state.
            </p>
          </div>
        </div>

        {/* In-page Reset Confirmation Modal (NO window.confirm!) */}
        {showResetConfirm && (
          <div
            role="dialog"
            aria-modal="true"
            className="p-5 bg-red-100 border-2 border-red-500 rounded-2xl space-y-3 animate-fade-in"
          >
            <div className="flex items-center gap-2 text-red-950 font-black text-lg">
              <span>⚠️</span>
              <span>Confirm Application State Reset</span>
            </div>
            <p className="text-sm font-semibold text-red-900">
              Are you sure you want to reset all team data, trials, and feedback items? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl bg-white border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetAll();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 font-black text-white text-sm"
              >
                Yes, Reset Everything
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
