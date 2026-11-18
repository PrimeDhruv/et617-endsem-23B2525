import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../lib/storage';
import { Variable } from '../types';
import {
  LEVELS_INFO,
  VARIABLES_CONFIG,
  HYPOTHESIS_DIRECTIONS,
} from '../data/content';
import { ProgressStrip } from '../components/ProgressStrip';
import { BigButton } from '../components/BigButton';

export const AskGuess: React.FC = () => {
  const navigate = useNavigate();
  const { activeTeam, addHypothesis } = useAppState();

  const level = activeTeam?.level || 'sapling';
  const mode = activeTeam?.mode || 'class';

  const [selectedVariable, setSelectedVariable] = useState<Variable>('light');
  const [selectedDirection, setSelectedDirection] = useState<'more' | 'fewer' | 'same'>('more');
  const [becauseText, setBecauseText] = useState('');

  // Class Mode Voting Tallies (+/- for each hypothesis option)
  const [tallies, setTallies] = useState<Record<'more' | 'fewer' | 'same', number>>({
    more: 0,
    fewer: 0,
    same: 0,
  });

  const levelInfo = LEVELS_INFO[level];
  const currentVarConfig = VARIABLES_CONFIG[selectedVariable];
  const currentDirectionConfig = HYPOTHESIS_DIRECTIONS.find(
    (d) => d.key === selectedDirection
  )!;

  const handleTally = (dir: 'more' | 'fewer' | 'same', delta: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTallies((prev) => ({
      ...prev,
      [dir]: Math.max(0, prev[dir] + delta),
    }));
  };

  const handleSaveAndProceed = () => {
    if (!activeTeam) return;

    const hypothesisId = `hyp-${Date.now()}`;
    addHypothesis(activeTeam.id, {
      id: hypothesisId,
      variable: selectedVariable,
      direction: selectedDirection,
      because: becauseText.trim() ? becauseText.trim() : undefined,
      createdAt: Date.now(),
    });

    navigate('/lab');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <ProgressStrip />

      {/* Main Question Card */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-plant-dark bg-plant-soft px-3 py-1 rounded-full border border-plant/30">
            {levelInfo.badge} {levelInfo.classNumber} Inquiry Question
          </span>
          {activeTeam && (
            <span className="text-sm font-bold text-gray-500">
              Team: <strong className="text-gray-900">{activeTeam.avatar} {activeTeam.name}</strong>
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-snug">
          {levelInfo.question}
        </h1>
        <p className="text-gray-600 text-lg">
          Choose a variable to investigate, make a scientific prediction, and test it!
        </p>
      </section>

      {/* Step 1: Choose Variable */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
          <span>1. Which ONE factor will you test?</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(VARIABLES_CONFIG) as Variable[]).map((varKey) => {
            const conf = VARIABLES_CONFIG[varKey];
            const isSelected = selectedVariable === varKey;
            return (
              <button
                key={varKey}
                type="button"
                onClick={() => setSelectedVariable(varKey)}
                className={`p-4 rounded-xl border-2 text-left transition-all min-h-[56px] flex items-center gap-3.5 ${
                  isSelected
                    ? 'border-plant bg-plant-soft ring-2 ring-plant shadow-sm scale-102'
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <span className="text-3xl sm:text-4xl">{conf.icon}</span>
                <div>
                  <div className="font-black text-lg text-gray-900">{conf.name}</div>
                  <div className="text-xs text-gray-500">{conf.prompt}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 2: Make Your Guess (Hypothesis) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900">
            2. What is your guess?
          </h2>
          {mode === 'class' && (
            <p className="text-plant-dark font-bold text-base flex items-center gap-1.5">
              <span>🙋</span>
              <span>Class vote: tap the answer most hands chose</span>
            </p>
          )}
        </div>

        {/* Hypothesis Direction Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {HYPOTHESIS_DIRECTIONS.map((dir) => {
            const isSelected = selectedDirection === dir.key;
            return (
              <div
                key={dir.key}
                onClick={() => setSelectedDirection(dir.key)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all min-h-[56px] flex flex-col justify-between ${
                  isSelected
                    ? `${dir.bg} ring-2 ring-plant shadow-sm scale-102`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-black text-lg">{dir.label}</span>
                  {isSelected && <span className="text-plant-dark text-xl font-bold">✓</span>}
                </div>

                {/* Class Mode Tally Counter */}
                {mode === 'class' && (
                  <div className="mt-3 pt-3 border-t border-gray-200 flex items-center justify-between text-sm">
                    <span className="font-bold text-gray-600">Votes: {tallies[dir.key]}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label={`Subtract vote for ${dir.label}`}
                        onClick={(e) => handleTally(dir.key, -1, e)}
                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-black text-gray-700 flex items-center justify-center text-lg active:scale-95"
                      >
                        –
                      </button>
                      <button
                        type="button"
                        aria-label={`Add vote for ${dir.label}`}
                        onClick={(e) => handleTally(dir.key, 1, e)}
                        className="w-8 h-8 rounded-lg bg-plant text-white hover:bg-plant-dark font-black flex items-center justify-center text-lg active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Live Sentence Display */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-300 text-lg sm:text-xl font-bold text-gray-800">
          💬 "I think when we increase <strong className="text-plant-dark">{currentVarConfig.name}</strong>, the plant will <strong className="text-water-dark">{currentDirectionConfig.phrase}</strong>."
        </div>

        {/* Optional "Because..." input */}
        <div className="space-y-2">
          <label htmlFor="because-input" className="block text-base sm:text-lg font-bold text-gray-700">
            Why do you think so? <span className="text-gray-400 font-normal">(optional reason)</span>:
          </label>
          <div className="relative">
            <input
              id="because-input"
              type="text"
              maxLength={120}
              value={becauseText}
              onChange={(e) => setBecauseText(e.target.value)}
              placeholder="because plants need energy to grow…"
              className="w-full min-h-[56px] px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-water focus:ring-2 focus:ring-water text-lg text-gray-900 bg-white"
            />
            <span className="absolute right-3 bottom-3 text-xs font-semibold text-gray-400 pointer-events-none">
              {120 - becauseText.length} left
            </span>
          </div>
        </div>
      </section>

      {/* Action Button */}
      <div className="text-center pt-2">
        <BigButton
          onClick={handleSaveAndProceed}
          variant="primary"
          size="large"
          className="w-full sm:w-auto shadow-md"
          icon="🧪"
        >
          Test this in the Lab
        </BigButton>
      </div>
    </div>
  );
};
