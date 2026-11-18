import React, { useEffect } from 'react';
import { Trial, Hypothesis, Setup } from '../types';
import { DETECTIVE_HINTS } from '../data/content';
import { BigButton } from './BigButton';

interface DetectiveHintsProps {
  currentClueLevel: number; // 1 to 4
  trials: Trial[];
  latestHypothesis?: Hypothesis | null;
  onUnlockClue: () => void;
  onTryExperiment: (setup: Setup) => void;
  onReviseGuess: () => void;
  onHighlightTrials: (trialIds: string[]) => void;
}

export const DetectiveHints: React.FC<DetectiveHintsProps> = ({
  currentClueLevel,
  trials,
  latestHypothesis,
  onUnlockClue,
  onTryExperiment,
  onReviseGuess,
  onHighlightTrials,
}) => {
  // Find two contrasting trials to compare in Clue 2 (e.g. 25°C vs 45°C, or 30% vs 100% light)
  const trialA = trials.length >= 2 ? trials[trials.length - 2] : trials[0];
  const trialB = trials.length >= 2 ? trials[trials.length - 1] : trials[trials.length - 1];

  // Highlight trials when Clue 2 or higher is active
  useEffect(() => {
    if (currentClueLevel >= 2 && trialA && trialB) {
      onHighlightTrials([trialA.id, trialB.id]);
    } else {
      onHighlightTrials([]);
    }
  }, [currentClueLevel, trialA, trialB, onHighlightTrials]);

  // Suggested setup for clue 3 (e.g. 35°C warmth test)
  const suggestedSetup: Setup = {
    light: trialB?.setup.light || 60,
    temp: 35,
    co2: trialB?.setup.co2 || 2,
  };

  return (
    <div className="w-full bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-7 shadow-md space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🕵️‍♂️</span>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            Detective Hint Ladder
          </h3>
        </div>
        <span className="text-xs font-black uppercase text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
          Clue {currentClueLevel} of 4 Unlocked
        </span>
      </div>

      <div className="space-y-4">
        {/* Step 1: Reflect */}
        <div
          className={`p-4 rounded-xl border-2 transition-all ${
            currentClueLevel >= 1
              ? 'bg-amber-50/80 border-amber-300 text-gray-900'
              : 'bg-gray-50 border-gray-200 opacity-50'
          }`}
        >
          <div className="flex items-center gap-2 font-black text-lg text-amber-900 mb-1">
            <span>🔍 {DETECTIVE_HINTS.step1.title}</span>
          </div>
          <p className="text-base sm:text-lg text-gray-800">
            {DETECTIVE_HINTS.step1.prompt}
          </p>
          {latestHypothesis && (
            <div className="mt-2 text-sm text-gray-600 bg-white p-2 rounded-lg border border-amber-200">
              Your guess was: when we increase <strong>{latestHypothesis.variable}</strong>, bubbles will <strong>{latestHypothesis.direction}</strong>.
            </div>
          )}
        </div>

        {/* Step 2: Compare */}
        {currentClueLevel >= 2 && (
          <div className="p-4 rounded-xl border-2 bg-blue-50/80 border-blue-300 text-gray-900 animate-fade-in space-y-3">
            <div className="flex items-center gap-2 font-black text-lg text-blue-900">
              <span>⚖️ {DETECTIVE_HINTS.step2.title}</span>
            </div>
            <p className="text-base sm:text-lg text-gray-800">
              Look at <strong>Trial #{trialA?.n}</strong> and <strong>Trial #{trialB?.n}</strong> in the table and chart. What is different between them? What happened to the bubble count?
            </p>
            {trialA && trialB && (
              <div className="grid grid-cols-2 gap-3 text-sm font-semibold bg-white p-3 rounded-lg border border-blue-200">
                <div className="border-r border-gray-200 pr-2">
                  <span className="text-xs text-gray-500 uppercase block">Trial #{trialA.n}</span>
                  <div>☀️ {trialA.setup.light}% · 🌡️ {trialA.setup.temp}°C · 🫧 {trialA.setup.co2}sp</div>
                  <div className="text-plant-dark font-black text-base mt-0.5">{trialA.bubbles} bubbles/min</div>
                </div>
                <div className="pl-2">
                  <span className="text-xs text-gray-500 uppercase block">Trial #{trialB.n}</span>
                  <div>☀️ {trialB.setup.light}% · 🌡️ {trialB.setup.temp}°C · 🫧 {trialB.setup.co2}sp</div>
                  <div className="text-plant-dark font-black text-base mt-0.5">{trialB.bubbles} bubbles/min</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Suggest Next Test */}
        {currentClueLevel >= 3 && (
          <div className="p-4 rounded-xl border-2 bg-green-50/80 border-green-300 text-gray-900 animate-fade-in space-y-3">
            <div className="flex items-center gap-2 font-black text-lg text-green-900">
              <span>🧪 {DETECTIVE_HINTS.step3.title}</span>
            </div>
            <p className="text-base sm:text-lg text-gray-800">
              {DETECTIVE_HINTS.step3.prompt}
            </p>
            <BigButton
              type="button"
              variant="primary"
              size="normal"
              onClick={() => onTryExperiment(suggestedSetup)}
              icon="🌱"
              className="text-base py-2.5 px-4"
            >
              Try 35°C in the Lab
            </BigButton>
          </div>
        )}

        {/* Step 4: Revise Guess */}
        {currentClueLevel >= 4 && (
          <div className="p-4 rounded-xl border-2 bg-purple-50/80 border-purple-300 text-gray-900 animate-fade-in space-y-3">
            <div className="flex items-center gap-2 font-black text-lg text-purple-900">
              <span>💡 {DETECTIVE_HINTS.step4.title}</span>
            </div>
            <p className="text-base sm:text-lg text-gray-800">
              {DETECTIVE_HINTS.step4.prompt}
            </p>
            <BigButton
              type="button"
              variant="accent"
              size="normal"
              onClick={onReviseGuess}
              icon="✏️"
              className="text-base py-2.5 px-5 bg-purple-600 text-white hover:bg-purple-700"
            >
              Change My Guess
            </BigButton>
          </div>
        )}
      </div>

      {/* Unlock next clue button if < 4 */}
      {currentClueLevel < 4 && (
        <div className="text-center pt-2">
          <BigButton
            type="button"
            variant="outline"
            onClick={onUnlockClue}
            icon="🔍"
            className="border-2 border-amber-400 bg-amber-50 hover:bg-amber-100 text-amber-950 font-black"
          >
            Unlock Next Clue 🔍 (Step {currentClueLevel + 1})
          </BigButton>
        </div>
      )}
    </div>
  );
};
