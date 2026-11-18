import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../lib/storage';
import { Trial } from '../types';
import {
  TASK_1_MCQ,
  TASK_2_TF,
  TASK_3_BAR,
  TASK_4_FAIR,
  TASK_5_OPEN,
  WHAT_YOU_DISCOVERED,
  LEVELS_INFO,
} from '../data/content';
import { ProgressStrip } from '../components/ProgressStrip';
import { BarChart } from '../components/BarChart';
import { FeedbackCard } from '../components/FeedbackCard';
import { BigButton } from '../components/BigButton';
import { requestFeedback } from '../lib/feedbackClient';

export const Check: React.FC = () => {
  const {
    activeTeam,
    recordTaskAnswer,
    addFeedbackItem,
    state,
  } = useAppState();

  const teamTrials = activeTeam?.trials || [];
  const level = activeTeam?.level || 'sapling';
  const mode = activeTeam?.mode || 'class';
  const levelBadge = LEVELS_INFO[level]?.badge || '🌿';

  // Fallback sample trials for Task 3 if the team has fewer than 3 trials
  const sampleTrials: Trial[] = [
    {
      id: 'sample-1',
      n: 1,
      setup: { light: 30, temp: 25, co2: 2 },
      bubbles: 6,
      changed: [],
      fair: true,
      timestamp: Date.now() - 30000,
    },
    {
      id: 'sample-2',
      n: 2,
      setup: { light: 100, temp: 25, co2: 2 },
      bubbles: 17,
      changed: ['light'],
      fair: true,
      timestamp: Date.now() - 20000,
    },
    {
      id: 'sample-3',
      n: 3,
      setup: { light: 100, temp: 45, co2: 2 },
      bubbles: 5,
      changed: ['temp'],
      fair: true,
      timestamp: Date.now() - 10000,
    },
  ];

  const chartTrials = teamTrials.length >= 3 ? teamTrials : sampleTrials;
  const maxTrialInChart = chartTrials.reduce(
    (max, t) => (t.bubbles > max.bubbles ? t : max),
    chartTrials[0]
  );

  // Local state for answers and checks
  const [task1Answer, setTask1Answer] = useState<string>('');
  const [task1Checked, setTask1Checked] = useState(false);

  const [task2Answer, setTask2Answer] = useState<string>('');
  const [task2Checked, setTask2Checked] = useState(false);

  const [task3SelectedTrialId, setTask3SelectedTrialId] = useState<string>('');
  const [task3Checked, setTask3Checked] = useState(false);

  const [task4Answer, setTask4Answer] = useState<string>('');
  const [task4Checked, setTask4Checked] = useState(false);

  const [task5Text, setTask5Text] = useState<string>('');
  const [task5Submitted, setTask5Submitted] = useState(false);
  const [isSubmittingTask5, setIsSubmittingTask5] = useState(false);

  // Feedback item for Task 5
  const pendingFeedbackItem = state.feedbackQueue.find(
    (item) => item.teamId === activeTeam?.id && item.taskId === 'task-5'
  );

  // Handlers for checking tasks
  const handleCheckTask1 = () => {
    if (!task1Answer) return;
    setTask1Checked(true);
    const isCorrect = task1Answer === TASK_1_MCQ.correctAnswer;
    if (activeTeam) {
      recordTaskAnswer(activeTeam.id, 'task-1', task1Answer, isCorrect);
    }
  };

  const handleCheckTask2 = () => {
    if (!task2Answer) return;
    setTask2Checked(true);
    const isCorrect = task2Answer === TASK_2_TF.correctAnswer;
    const isM2 = task2Answer === 'true';
    if (activeTeam) {
      recordTaskAnswer(
        activeTeam.id,
        'task-2',
        task2Answer,
        isCorrect,
        isM2 ? 'M2' : undefined
      );
    }
  };

  const handleCheckTask3 = () => {
    if (!task3SelectedTrialId) return;
    setTask3Checked(true);
    const isCorrect = task3SelectedTrialId === maxTrialInChart.id;
    if (activeTeam) {
      recordTaskAnswer(activeTeam.id, 'task-3', task3SelectedTrialId, isCorrect);
    }
  };

  const handleCheckTask4 = () => {
    if (!task4Answer) return;
    setTask4Checked(true);
    const isCorrect = task4Answer === TASK_4_FAIR.correctAnswer;
    if (activeTeam) {
      recordTaskAnswer(activeTeam.id, 'task-4', task4Answer, isCorrect);
    }
  };

  const handleSubmitTask5 = async () => {
    if (!task5Text.trim() || !activeTeam || isSubmittingTask5) return;

    setIsSubmittingTask5(true);
    try {
      const feedbackItem = await requestFeedback({
        teamId: activeTeam.id,
        taskId: 'task-5',
        question: TASK_5_OPEN.question,
        answer: task5Text.trim(),
        level: activeTeam.level,
        trials: activeTeam.trials,
        hypothesis:
          activeTeam.hypotheses.length > 0
            ? activeTeam.hypotheses[activeTeam.hypotheses.length - 1]
            : null,
      });

      addFeedbackItem(feedbackItem);
      setTask5Submitted(true);
      recordTaskAnswer(
        activeTeam.id,
        'task-5',
        task5Text.trim(),
        null,
        feedbackItem.misconception !== 'none' ? feedbackItem.misconception : undefined
      );
    } finally {
      setIsSubmittingTask5(false);
    }
  };

  // Calculate score /4 for tasks 1-4
  const completedTasks = [
    task1Checked ? task1Answer === TASK_1_MCQ.correctAnswer : null,
    task2Checked ? task2Answer === TASK_2_TF.correctAnswer : null,
    task3Checked ? task3SelectedTrialId === maxTrialInChart.id : null,
    task4Checked ? task4Answer === TASK_4_FAIR.correctAnswer : null,
  ];

  const score = completedTasks.filter((res) => res === true).length;
  const allChecked = task1Checked && task2Checked && task3Checked && task4Checked && task5Submitted;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <ProgressStrip />

      {/* Header */}
      <section className="bg-white p-6 sm:p-7 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-plant-dark bg-plant-soft px-3 py-1 rounded-full border border-plant/30">
            Step 4 · Mastery Assessment
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-1">
            Check Your Understanding ✅
          </h1>
          <p className="text-gray-600 text-base sm:text-lg mt-0.5">
            5 questions to test your scientific discovery about plants, bubbles, and fair testing!
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-gray-500 uppercase block">Score (Tasks 1–4)</span>
          <span className="text-3xl font-black text-plant-dark">{score} / 4</span>
        </div>
      </section>

      {/* Task 1: MCQ (Light Distance) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {TASK_1_MCQ.title}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            Multiple Choice
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-800">
          {TASK_1_MCQ.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {TASK_1_MCQ.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={task1Checked}
              onClick={() => setTask1Answer(opt.id)}
              className={`p-4 rounded-xl border-2 text-left font-bold text-lg min-h-[56px] transition-all ${
                task1Answer === opt.id
                  ? 'border-plant bg-plant-soft ring-2 ring-plant'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {!task1Checked ? (
          <div className="pt-2">
            <BigButton
              type="button"
              disabled={!task1Answer}
              onClick={handleCheckTask1}
              variant="primary"
              size="normal"
            >
              Check ✓
            </BigButton>
          </div>
        ) : (
          <div
            className={`p-4 rounded-xl border-2 font-bold text-lg ${
              task1Answer === 'increase'
                ? 'bg-green-50 border-green-400 text-green-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {task1Answer === 'increase'
              ? TASK_1_MCQ.feedback.correct
              : task1Answer === 'decrease'
              ? TASK_1_MCQ.feedback.decrease
              : TASK_1_MCQ.feedback.same}
          </div>
        )}
      </section>

      {/* Task 2: True/False (Darkness Misconception M2) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {TASK_2_TF.title}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            True or False
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-800">
          "{TASK_2_TF.question}"
        </p>

        <div className="grid grid-cols-2 gap-3 max-w-md">
          {TASK_2_TF.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={task2Checked}
              onClick={() => setTask2Answer(opt.id)}
              className={`p-4 rounded-xl border-2 text-center font-black text-xl min-h-[56px] transition-all ${
                task2Answer === opt.id
                  ? 'border-water-dark bg-water-soft ring-2 ring-water'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {!task2Checked ? (
          <div className="pt-2">
            <BigButton
              type="button"
              disabled={!task2Answer}
              onClick={handleCheckTask2}
              variant="primary"
              size="normal"
            >
              Check ✓
            </BigButton>
          </div>
        ) : (
          <div
            className={`p-4 rounded-xl border-2 font-bold text-lg ${
              task2Answer === 'false'
                ? 'bg-green-50 border-green-400 text-green-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {task2Answer === 'false'
              ? TASK_2_TF.feedback.correct
              : TASK_2_TF.feedback.incorrect}
          </div>
        )}
      </section>

      {/* Task 3: Tap the Bar Chart */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {TASK_3_BAR.title}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            Interactive Chart
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-800">
          {TASK_3_BAR.question}
        </p>

        {teamTrials.length < 3 && (
          <p className="text-xs text-gray-500 italic">
            (Showing standard classroom experiment chart with 3 trials)
          </p>
        )}

        <BarChart
          trials={chartTrials}
          isInteractive={!task3Checked}
          selectedBarTrialId={task3SelectedTrialId}
          onSelectBar={(trialId) => {
            if (!task3Checked) setTask3SelectedTrialId(trialId);
          }}
        />

        {!task3Checked ? (
          <div className="pt-2 flex items-center gap-3">
            <BigButton
              type="button"
              disabled={!task3SelectedTrialId}
              onClick={handleCheckTask3}
              variant="primary"
              size="normal"
            >
              Check Selected Bar ✓
            </BigButton>
            <span className="text-sm font-semibold text-gray-500">
              {task3SelectedTrialId ? 'Bar selected! Now tap Check.' : 'Tap any bar above to select.'}
            </span>
          </div>
        ) : (
          <div
            className={`p-4 rounded-xl border-2 font-bold text-lg ${
              task3SelectedTrialId === maxTrialInChart.id
                ? 'bg-green-50 border-green-400 text-green-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {task3SelectedTrialId === maxTrialInChart.id
              ? TASK_3_BAR.feedback.correct
              : TASK_3_BAR.feedback.incorrect}
          </div>
        )}
      </section>

      {/* Task 4: Pick the Fair Test */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {TASK_4_FAIR.title}
          </h2>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
            Experimental Design
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-800">
          {TASK_4_FAIR.question}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TASK_4_FAIR.options.map((opt) => (
            <button
              key={opt.id}
              type="button"
              disabled={task4Checked}
              onClick={() => setTask4Answer(opt.id)}
              className={`p-5 rounded-2xl border-2 text-left transition-all min-h-[56px] space-y-2 ${
                task4Answer === opt.id
                  ? 'border-plant bg-plant-soft ring-2 ring-plant shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-xl text-gray-900">{opt.title}</span>
                <span className="text-2xl">{opt.id === 'A' ? '⚖️' : '⚠️'}</span>
              </div>
              <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line font-medium">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>

        {!task4Checked ? (
          <div className="pt-2">
            <BigButton
              type="button"
              disabled={!task4Answer}
              onClick={handleCheckTask4}
              variant="primary"
              size="normal"
            >
              Check ✓
            </BigButton>
          </div>
        ) : (
          <div
            className={`p-4 rounded-xl border-2 font-bold text-lg ${
              task4Answer === 'A'
                ? 'bg-green-50 border-green-400 text-green-950'
                : 'bg-amber-50 border-amber-400 text-amber-950'
            }`}
          >
            {task4Answer === 'A'
              ? TASK_4_FAIR.feedback.correct
              : TASK_4_FAIR.feedback.incorrect}
          </div>
        )}
      </section>

      {/* Task 5: Open-Ended Explanation (Gemini AI + Teacher-in-the-Loop C5) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            {TASK_5_OPEN.title}
          </h2>
          <span className="text-xs font-black uppercase text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
            AI + Teacher Guided (C5)
          </span>
        </div>

        <p className="text-lg sm:text-xl font-bold text-gray-800">
          {TASK_5_OPEN.question}
        </p>

        {!task5Submitted && !pendingFeedbackItem ? (
          <div className="space-y-3">
            <textarea
              rows={3}
              value={task5Text}
              onChange={(e) => setTask5Text(e.target.value)}
              placeholder={
                mode === 'class'
                  ? TASK_5_OPEN.classPlaceholder
                  : TASK_5_OPEN.placeholder
              }
              className="w-full p-4 rounded-xl border-2 border-gray-300 focus:border-water focus:ring-2 focus:ring-water text-lg text-gray-900"
            />
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Your response goes to your teacher for approval.
              </span>
              <BigButton
                type="button"
                disabled={!task5Text.trim() || isSubmittingTask5}
                onClick={handleSubmitTask5}
                variant="primary"
                size="normal"
                icon="📤"
              >
                {isSubmittingTask5 ? 'Sending…' : 'Submit for Teacher Review'}
              </BigButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-base text-gray-800">
              <span className="text-xs font-bold uppercase text-gray-500 block">Your Answer:</span>
              <span className="font-semibold">{task5Text || pendingFeedbackItem?.answer}</span>
            </div>
            {/* Live Feedback Card connected to Teacher Queue */}
            <FeedbackCard item={pendingFeedbackItem} />
          </div>
        )}
      </section>

      {/* Final End Summary (Appears once tasks are checked) */}
      {allChecked && (
        <section className="bg-gradient-to-b from-plant-soft to-white p-6 sm:p-8 rounded-2xl border-2 border-plant shadow-md space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <span className="text-5xl">{levelBadge}</span>
            <h2 className="text-3xl sm:text-4xl font-black text-plant-dark">
              Congratulations, Young Scientist!
            </h2>
            <p className="text-lg text-gray-700 font-bold">
              You completed all 5 inquiry challenges with score {score}/4!
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 space-y-3">
            <h3 className="font-black text-xl text-gray-900">
              🌱 What You Discovered Today:
            </h3>
            <ul className="space-y-2">
              {WHAT_YOU_DISCOVERED.map((point, idx) => (
                <li key={idx} className="text-base sm:text-lg font-semibold text-gray-800 flex items-start gap-2">
                  <span>✓</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/lab"
              className="w-full sm:w-auto min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-plant font-bold text-plant-dark hover:bg-plant-soft flex items-center justify-center gap-2"
            >
              <span>🧪 Run More Lab Trials</span>
            </Link>
            <Link
              to="/"
              className="w-full sm:w-auto min-h-[56px] px-8 py-3.5 rounded-2xl bg-plant text-white font-extrabold text-xl hover:bg-plant-dark flex items-center justify-center gap-2 shadow-md"
            >
              <span>🎉 Finish Investigation</span>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};
