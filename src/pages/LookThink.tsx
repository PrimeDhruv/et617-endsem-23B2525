import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../lib/storage';
import { Setup } from '../types';
import { ProgressStrip } from '../components/ProgressStrip';
import { ResultsTable } from '../components/ResultsTable';
import { BarChart } from '../components/BarChart';
import { DetectiveHints } from '../components/DetectiveHints';
import { BigButton } from '../components/BigButton';

export const LookThink: React.FC = () => {
  const navigate = useNavigate();
  const { activeTeam, incrementHintsUsed, recordMisconceptionSeen } = useAppState();

  const trials = activeTeam?.trials || [];
  const hypotheses = activeTeam?.hypotheses || [];
  const latestHypothesis = hypotheses.length > 0 ? hypotheses[hypotheses.length - 1] : null;

  const [clueLevel, setClueLevel] = useState(1);
  const [highlightedTrialIds, setHighlightedTrialIds] = useState<string[]>([]);

  // Evaluate if hypothesis was supported
  const checkHypothesisSupported = (): {
    supported: boolean;
    reason: string;
    isUnfair: boolean;
  } => {
    if (trials.length < 2) {
      return {
        supported: false,
        reason: 'Run at least 2 trials to compare and test your guess.',
        isUnfair: false,
      };
    }

    if (!latestHypothesis) {
      return {
        supported: false,
        reason: 'No guess recorded yet.',
        isUnfair: false,
      };
    }

    const { variable, direction } = latestHypothesis;

    // Find trials that varied this variable
    const relevantTrials = trials.filter(
      (t, idx) => idx === 0 || t.changed.includes(variable)
    );

    const hasUnfairTrials = relevantTrials.some((t) => !t.fair);

    if (hasUnfairTrials) {
      return {
        supported: false,
        reason: 'One or more of your trials changed 2+ factors at once (unfair test).',
        isUnfair: true,
      };
    }

    // Special check for temperature misconception (M1):
    // If guessed 'more' but tested 45°C where bubbles dropped
    if (variable === 'temp') {
      const trial45 = trials.find((t) => t.setup.temp === 45);
      const trial25or35 = trials.find((t) => t.setup.temp === 25 || t.setup.temp === 35);

      if (trial45 && trial25or35 && trial45.bubbles < trial25or35.bubbles) {
        if (activeTeam) recordMisconceptionSeen(activeTeam.id, 'M1');
        return {
          supported: false,
          reason: 'At 45°C warmth, the bubbles dropped instead of increasing!',
          isUnfair: false,
        };
      }
    }

    // Light check:
    if (variable === 'light') {
      const zeroLightTrial = trials.find((t) => t.setup.light === 0);
      if (zeroLightTrial && zeroLightTrial.bubbles === 0 && direction === 'same') {
        if (activeTeam) recordMisconceptionSeen(activeTeam.id, 'M2');
      }

      // If guessed 'more', check if higher light trial has more bubbles
      if (trials.length >= 2) {
        const first = trials[0];
        const last = trials[trials.length - 1];
        if (direction === 'more' && last.setup.light > first.setup.light && last.bubbles > first.bubbles) {
          return { supported: true, reason: 'Stronger light produced more oxygen bubbles!', isUnfair: false };
        }
      }
    }

    // Generic direction matching
    if (trials.length >= 2) {
      const t1 = trials[trials.length - 2];
      const t2 = trials[trials.length - 1];

      const val1 = t1.setup[variable];
      const val2 = t2.setup[variable];

      const valIncreased = val2 > val1;
      const bubblesIncreased = t2.bubbles > t1.bubbles;
      const bubblesSame = t2.bubbles === t1.bubbles;
      const bubblesDecreased = t2.bubbles < t1.bubbles;

      if (direction === 'more' && valIncreased && bubblesIncreased) {
        return { supported: true, reason: 'Your guess matched the plant!', isUnfair: false };
      }
      if (direction === 'same' && valIncreased && bubblesSame) {
        return { supported: true, reason: 'Your guess matched the plant!', isUnfair: false };
      }
      if (direction === 'fewer' && valIncreased && bubblesDecreased) {
        return { supported: true, reason: 'Your guess matched the plant!', isUnfair: false };
      }
    }

    return {
      supported: false,
      reason: 'The plant produced a different bubble count than expected.',
      isUnfair: false,
    };
  };

  const evalResult = checkHypothesisSupported();

  const handleUnlockClue = () => {
    if (activeTeam) {
      incrementHintsUsed(activeTeam.id);
    }
    setClueLevel((prev) => Math.min(4, prev + 1));
  };

  const handleTryExperiment = (preloadedSetup: Setup) => {
    navigate('/lab', { state: { preloadSetup: preloadedSetup } });
  };

  const handleReviseGuess = () => {
    navigate('/ask');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProgressStrip />

      {/* Header */}
      <section className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-plant-dark bg-plant-soft px-3 py-1 rounded-full border border-plant/30">
            Step 3 · Data Interpretation
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mt-1">
            Look & Think 🔍
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/lab"
            className="min-h-[44px] px-4 py-2 rounded-xl border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
          >
            <span>🧪</span>
            <span>Back to Lab</span>
          </Link>
          <Link
            to="/check"
            className="min-h-[44px] px-4 py-2 rounded-xl bg-plant text-white font-bold hover:bg-plant-dark flex items-center gap-1.5 shadow-sm"
          >
            <span>Check & Learn</span>
            <span>➔</span>
          </Link>
        </div>
      </section>

      {/* Observation Table and SVG Bar Chart */}
      <div className="space-y-5">
        <ResultsTable
          trials={trials}
          highlightTrialIds={highlightedTrialIds}
        />
        <BarChart trials={trials} />
      </div>

      {/* Guess vs Results Evaluation Card */}
      <section className="space-y-4">
        {evalResult.supported ? (
          /* Supported Path */
          <div className="bg-green-50 border-3 border-green-500 p-6 sm:p-7 rounded-2xl shadow-md space-y-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-green-950">
                  Your guess matched the plant!
                </h3>
                <p className="text-lg text-green-900 font-bold mt-1">
                  Your test was fair too! The plant reacted just as your hypothesis predicted.
                </p>
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <BigButton
                onClick={() => navigate('/check')}
                variant="primary"
                size="normal"
                icon="✅"
              >
                Go to Check & Learn Screen ➔
              </BigButton>
            </div>
          </div>
        ) : (
          /* Not Supported / Surprise Path */
          <div className="space-y-5">
            <div className="bg-amber-50 border-3 border-amber-400 p-6 sm:p-7 rounded-2xl shadow-md space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-4xl sm:text-5xl">🤔</span>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-amber-950">
                    Surprise! The plant did something different.
                  </h3>
                  <p className="text-lg text-amber-900 font-bold mt-1">
                    {evalResult.reason}
                  </p>
                  <p className="text-base text-gray-700 mt-1">
                    Don’t worry! In science, unexpected results are the most exciting part. Use the clues below to investigate!
                  </p>
                </div>
              </div>
            </div>

            {/* Growth Mindset Banner */}
            <div className="p-4 bg-gradient-to-r from-purple-100 via-indigo-50 to-blue-100 rounded-2xl border border-indigo-200 text-center text-lg sm:text-xl font-black text-indigo-950 shadow-sm">
              🔬 "Scientists get surprised too. That’s how they learn!" 💡
            </div>

            {/* Detective Hints 4-Step Ladder */}
            <DetectiveHints
              currentClueLevel={clueLevel}
              trials={trials}
              latestHypothesis={latestHypothesis}
              onUnlockClue={handleUnlockClue}
              onTryExperiment={handleTryExperiment}
              onReviseGuess={handleReviseGuess}
              onHighlightTrials={setHighlightedTrialIds}
            />
          </div>
        )}
      </section>
    </div>
  );
};
