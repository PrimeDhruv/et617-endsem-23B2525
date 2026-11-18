import React, { useState } from 'react';
import { useAppState } from '../lib/storage';
import { Level } from '../types';
import { TEACHER_PIN, ALL_CLASS_STUDENTS } from '../data/content';
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

  // PIN gate state
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);

  // In-page reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Collapsible Reviewed section
  const [showReviewedList, setShowReviewedList] = useState(false);

  // Section B Sub-Tab: 'voting' | 'performance' | 'roster'
  const [sectionBTab, setSectionBTab] = useState<'voting' | 'performance' | 'roster'>('voting');

  // Filter for students / voting
  const [voteFilter, setVoteFilter] = useState<'all' | 'more' | 'fewer' | 'same'>('all');

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

  // Voting analysis
  const classVotes = state.classVotes || ALL_CLASS_STUDENTS.map((s) => ({
    studentName: s.name,
    teamName: s.team,
    vote: s.defaultVote,
    variable: 'light' as const,
    timestamp: Date.now() - 3600000,
  }));

  const moreVotesCount = classVotes.filter((v) => v.vote === 'more').length;
  const fewerVotesCount = classVotes.filter((v) => v.vote === 'fewer').length;
  const sameVotesCount = classVotes.filter((v) => v.vote === 'same').length;
  const totalVotesCount = classVotes.length;

  const filteredVotes = voteFilter === 'all'
    ? classVotes
    : classVotes.filter((v) => v.vote === voteFilter);

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
            Constraint <strong>C5 (Teacher-in-the-loop)</strong>: Enter the teacher PIN to monitor student rosters, voting records, and review AI feedback.
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
              Teacher Review & Student Analytics
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
            <span className="text-xs font-bold text-gray-500 uppercase block">Active Teams / Students</span>
            <div className="text-3xl font-black text-gray-900">{teams.length} teams · 12 students</div>
            <div className="text-xs text-gray-500">Multi-grade classroom (Cl. 3–5)</div>
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
            No feedback reaches students until you approve, edit, or override below.
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

      {/* SECTION B: STUDENT ROSTER, VOTING RECORDS & PERFORMANCE ANALYTICS */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 pb-3 border-b border-gray-200">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-water-dark bg-water-soft px-3 py-1 rounded-full border border-water/30">
              Formative Diagnostics
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
              Section B: Student Roster, Voting Records & Performance
            </h2>
            <p className="text-gray-600 text-base mt-0.5">
              Live breakdown of who the students are, how they voted, and their scientific investigation performance.
            </p>
          </div>

          {/* Sub-Tab Navigation */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl border border-gray-200 text-sm font-bold">
            <button
              type="button"
              onClick={() => setSectionBTab('voting')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                sectionBTab === 'voting'
                  ? 'bg-white text-plant-dark shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🗳️ Class Voting Records
            </button>
            <button
              type="button"
              onClick={() => setSectionBTab('performance')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                sectionBTab === 'performance'
                  ? 'bg-white text-plant-dark shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Performance & Diagnostics
            </button>
            <button
              type="button"
              onClick={() => setSectionBTab('roster')}
              className={`px-3.5 py-2 rounded-lg transition-all ${
                sectionBTab === 'roster'
                  ? 'bg-white text-plant-dark shadow-sm font-black'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Student Teams Roster
            </button>
          </div>
        </div>

        {/* TAB 1: WHO ALL HAVE VOTED (VOTING POLL & INDIVIDUAL VOTES) */}
        {sectionBTab === 'voting' && (
          <div className="space-y-6 animate-fade-in">
            {/* Visual Voting Summary Poll */}
            <div className="p-5 bg-gradient-to-r from-blue-50/70 via-green-50/70 to-amber-50/70 rounded-2xl border border-gray-200 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-black text-xl text-gray-900 flex items-center gap-2">
                  <span>🗳️ Hypothesis Voting Distribution:</span>
                  <span className="text-sm font-bold text-gray-600">
                    "{teams[0]?.hypotheses?.[0]?.variable || 'Variable'} Effect on Bubbles"
                  </span>
                </h3>
                <span className="text-sm font-bold px-3 py-1 bg-white rounded-full border border-gray-300 text-gray-700">
                  Total Votes Cast: <strong>{totalVotesCount} / 12 Students</strong>
                </span>
              </div>

              {/* Graphical Poll Bar */}
              <div className="space-y-1.5">
                <div className="w-full h-7 bg-gray-200 rounded-xl overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${(moreVotesCount / totalVotesCount) * 100}%` }}
                    className="bg-green-600 text-white text-xs font-black flex items-center justify-center transition-all"
                    title={`More: ${moreVotesCount} votes`}
                  >
                    {moreVotesCount > 0 ? `⬆ More (${Math.round((moreVotesCount / totalVotesCount) * 100)}%)` : ''}
                  </div>
                  <div
                    style={{ width: `${(fewerVotesCount / totalVotesCount) * 100}%` }}
                    className="bg-amber-500 text-white text-xs font-black flex items-center justify-center transition-all"
                    title={`Fewer: ${fewerVotesCount} votes`}
                  >
                    {fewerVotesCount > 0 ? `⬇ Fewer (${Math.round((fewerVotesCount / totalVotesCount) * 100)}%)` : ''}
                  </div>
                  <div
                    style={{ width: `${(sameVotesCount / totalVotesCount) * 100}%` }}
                    className="bg-blue-500 text-white text-xs font-black flex items-center justify-center transition-all"
                    title={`Same: ${sameVotesCount} votes`}
                  >
                    {sameVotesCount > 0 ? `➖ Same (${Math.round((sameVotesCount / totalVotesCount) * 100)}%)` : ''}
                  </div>
                </div>

                <div className="flex justify-between text-xs font-bold text-gray-600 px-1">
                  <span className="text-green-800">⬆ More: {moreVotesCount} students</span>
                  <span className="text-amber-800">⬇ Fewer: {fewerVotesCount} students</span>
                  <span className="text-blue-800">➖ Same: {sameVotesCount} students</span>
                </div>
              </div>
            </div>

            {/* Filter by Vote Choice */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-600">Filter Voters:</span>
                {(['all', 'more', 'fewer', 'same'] as const).map((filterOpt) => (
                  <button
                    key={filterOpt}
                    type="button"
                    onClick={() => setVoteFilter(filterOpt)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                      voteFilter === filterOpt
                        ? 'bg-plant text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {filterOpt === 'all'
                      ? 'All (12)'
                      : filterOpt === 'more'
                      ? `More (${moreVotesCount})`
                      : filterOpt === 'fewer'
                      ? `Fewer (${fewerVotesCount})`
                      : `Same (${sameVotesCount})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Individual Student Voting Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredVotes.map((v, idx) => {
                const teamObj = teams.find((t) => t.name.toLowerCase().includes(v.teamName.toLowerCase()));
                const voteColor =
                  v.vote === 'more'
                    ? 'border-green-300 bg-green-50/70 text-green-950'
                    : v.vote === 'fewer'
                    ? 'border-amber-300 bg-amber-50/70 text-amber-950'
                    : 'border-blue-300 bg-blue-50/70 text-blue-950';

                const voteBadge =
                  v.vote === 'more'
                    ? 'bg-green-600 text-white'
                    : v.vote === 'fewer'
                    ? 'bg-amber-600 text-white'
                    : 'bg-blue-600 text-white';

                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 flex items-center justify-between gap-3 ${voteColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{teamObj?.avatar || '👤'}</span>
                      <div>
                        <div className="font-black text-base text-gray-900">{v.studentName}</div>
                        <div className="text-xs font-semibold text-gray-500">
                          {v.teamName} · {teamObj?.level ? `Class ${teamObj.level === 'seedling' ? '3' : teamObj.level === 'sapling' ? '4' : '5'}` : 'Student'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-black uppercase ${voteBadge}`}>
                        {v.vote === 'more' ? '⬆ More' : v.vote === 'fewer' ? '⬇ Fewer' : '➖ Same'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: STUDENT & TEAM PERFORMANCE DIAGNOSTICS */}
        {sectionBTab === 'performance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.map((team) => {
                const fairCount = team.trials.filter((t) => t.fair).length;
                const fairPct = team.trials.length > 0 ? Math.round((fairCount / team.trials.length) * 100) : 100;

                const correctCount = Object.values(team.taskAnswers).filter(
                  (a) => a.correct === true
                ).length;

                const latestHyp = team.hypotheses.length > 0 ? team.hypotheses[team.hypotheses.length - 1] : null;

                const hasM1 = team.misconceptionsSeen.includes('M1');
                const hasM2 = team.misconceptionsSeen.includes('M2');

                const statusBadge =
                  correctCount >= 4 && !hasM1 && !hasM2
                    ? { label: '🌟 High Mastery', bg: 'bg-green-100 text-green-900 border-green-300' }
                    : hasM1
                    ? { label: '⚠️ Heat Misconception (M1)', bg: 'bg-alert-soft text-alert-dark border-alert-light' }
                    : { label: '🌱 Active Inquirer', bg: 'bg-blue-100 text-blue-900 border-blue-300' };

                return (
                  <div
                    key={team.id}
                    className="p-5 rounded-2xl border-2 border-gray-200 bg-white shadow-sm space-y-4 hover:border-gray-400 transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{team.avatar}</span>
                        <div>
                          <h4 className="font-black text-xl text-gray-900">{team.name}</h4>
                          <span className="text-xs font-bold uppercase text-gray-500">
                            {team.level} ({team.level === 'seedling' ? 'Class 3' : team.level === 'sapling' ? 'Class 4' : 'Class 5'})
                          </span>
                        </div>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-black border ${statusBadge.bg}`}>
                        {statusBadge.label}
                      </span>
                    </div>

                    {/* Students in Team */}
                    <div className="text-sm">
                      <span className="text-xs font-bold uppercase text-gray-400 block mb-1">
                        Students Enrolled:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(team.students || ['Aarav Patel', 'Diya Sharma']).map((stu, i) => (
                          <span
                            key={i}
                            className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md text-xs font-semibold"
                          >
                            👤 {stu}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Performance Metrics Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-500 block font-bold">Trials Run</span>
                        <span className="text-lg font-black text-gray-900">{team.trials.length}</span>
                        <span className="text-gray-400 block">({fairPct}% fair)</span>
                      </div>

                      <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-500 block font-bold">Task Score</span>
                        <span className="text-lg font-black text-plant-dark">{correctCount} / 5</span>
                        <span className="text-gray-400 block">Formative</span>
                      </div>

                      <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="text-gray-500 block font-bold">Hints Used</span>
                        <span className="text-lg font-black text-water-dark">{team.hintsUsed}</span>
                        <span className="text-gray-400 block">Detective</span>
                      </div>
                    </div>

                    {/* Hypothesis & Scientific Evidence */}
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-600">Active Hypothesis:</span>
                        <span className="font-mono font-bold text-plant-dark">
                          {latestHyp ? `${latestHyp.variable} ➔ ${latestHyp.direction}` : 'None'}
                        </span>
                      </div>
                      {team.trials.length > 0 && (
                        <div className="text-gray-600 pt-1 border-t border-gray-200">
                          Latest trial: {team.trials[team.trials.length - 1].bubbles} bubbles/min at {team.trials[team.trials.length - 1].setup.temp}°C
                        </div>
                      )}
                    </div>

                    {/* Teacher Actionable Recommendation */}
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs font-semibold text-amber-950">
                      💡 <strong>Teacher Intervention:</strong>{' '}
                      {hasM1
                        ? 'Student observed bubble drop at 45°C. Guide with Clue 2: compare 25°C vs 45°C on projector!'
                        : correctCount >= 4
                        ? 'Excellent conceptual understanding! Ready for advanced Tree-level photosynthesis tasks.'
                        : 'Encourage team to run one more fair test altering only ONE variable.'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE MULTI-GRADE STUDENT ROSTER */}
        {sectionBTab === 'roster' && (
          <div className="space-y-4 animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-base">
                <thead>
                  <tr className="bg-gray-100 text-gray-700 border-b border-gray-200 text-xs uppercase font-black">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Team</th>
                    <th className="py-3 px-3">Grade</th>
                    <th className="py-3 px-3">Hypothesis Vote</th>
                    <th className="py-3 px-3">Lab Experiments</th>
                    <th className="py-3 px-3">Task Score</th>
                    <th className="py-3 px-3">Misconceptions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ALL_CLASS_STUDENTS.map((stu, i) => {
                    const teamObj = teams.find((t) => t.name.toLowerCase().includes(stu.team.toLowerCase()));
                    const trialsCount = teamObj?.trials.length || 0;
                    const correctCount = teamObj
                      ? Object.values(teamObj.taskAnswers).filter((a) => a.correct === true).length
                      : 0;
                    const hasM1 = teamObj?.misconceptionsSeen.includes('M1');

                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="py-3 px-3 font-bold text-gray-900">
                          👤 {stu.name}
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-700 flex items-center gap-1">
                          <span>{stu.avatar}</span>
                          <span>{stu.team}</span>
                        </td>
                        <td className="py-3 px-3 text-xs font-bold text-gray-600">
                          {stu.grade}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-black uppercase ${
                              stu.defaultVote === 'more'
                                ? 'bg-green-100 text-green-900'
                                : stu.defaultVote === 'fewer'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-blue-100 text-blue-900'
                            }`}
                          >
                            {stu.defaultVote === 'more' ? '⬆ More' : stu.defaultVote === 'fewer' ? '⬇ Fewer' : '➖ Same'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-sm font-semibold text-gray-800">
                          {trialsCount} trials
                        </td>
                        <td className="py-3 px-3 font-black text-plant-dark">
                          {correctCount} / 5
                        </td>
                        <td className="py-3 px-3">
                          {hasM1 ? (
                            <span className="text-xs font-black bg-alert-soft text-alert-dark px-2 py-0.5 rounded-full border border-alert-light">
                              M1 (Heat)
                            </span>
                          ) : (
                            <span className="text-xs text-green-700 font-bold">Clear ✓</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
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
              Load Demo Scenario (All Teams & Parrots M1):
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
              Loads 4 teams, 12 students, votes, trials at 25°C & 45°C, and pending review item.
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
