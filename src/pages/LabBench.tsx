import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAppState } from '../lib/storage';
import { Setup, Trial, LightLevel, Temp, Spoons } from '../types';
import { bubblesPerMinute, DEFAULT_SETUP } from '../lib/model';
import { detectChangedVariables } from '../lib/fairTest';
import { ProgressStrip } from '../components/ProgressStrip';
import { LabScene } from '../components/LabScene';
import { BubbleCounter } from '../components/BubbleCounter';
import { FairTestWarning } from '../components/FairTestWarning';
import { BigButton } from '../components/BigButton';

export const LabBench: React.FC = () => {
  const location = useLocation();
  const { activeTeam, addTrial, recordMisconceptionSeen } = useAppState();

  const teamTrials = activeTeam?.trials || [];
  const previousTrial = teamTrials.length > 0 ? teamTrials[teamTrials.length - 1] : undefined;

  // Setup state (preloaded if passed via location.state, else previous trial setup or DEFAULT_SETUP)
  const initialSetup: Setup =
    (location.state as { preloadSetup?: Setup })?.preloadSetup ||
    previousTrial?.setup ||
    DEFAULT_SETUP;

  const [setup, setSetup] = useState<Setup>(initialSetup);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [liveBubbleCount, setLiveBubbleCount] = useState(0);
  const [showFairWarning, setShowFairWarning] = useState(false);
  const [lastCompletedTrial, setLastCompletedTrial] = useState<Trial | null>(null);

  const runTimerRef = useRef<number | null>(null);

  // Compute changed variables from previous trial
  const changedVars = detectChangedVariables(setup, previousTrial?.setup);
  const isFairTest = changedVars.length <= 1;

  // Reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (runTimerRef.current) clearInterval(runTimerRef.current);
    };
  }, []);

  const handleStartRunClick = () => {
    // If not first trial and more than 1 variable changed, prompt with FairTestWarning
    if (previousTrial && !isFairTest) {
      setShowFairWarning(true);
      return;
    }
    executeRun(true);
  };

  const executeRun = (fair: boolean) => {
    setShowFairWarning(false);
    const finalBubbles = bubblesPerMinute(setup);

    // Fast-path for reduced motion
    if (prefersReducedMotion) {
      completeTrial(finalBubbles, fair);
      return;
    }

    setIsRunning(true);
    setSecondsLeft(10);
    setLiveBubbleCount(0);

    const startTime = Date.now();
    const durationMs = 10000; // 10-second animation

    runTimerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingSeconds = Math.max(0, Math.ceil((durationMs - elapsed) / 1000));
      setSecondsLeft(remainingSeconds);

      // Interpolate bubble count up to final value
      const progress = Math.min(1, elapsed / durationMs);
      const currentInterpolated = Math.round(progress * finalBubbles);
      setLiveBubbleCount(currentInterpolated);

      if (elapsed >= durationMs) {
        if (runTimerRef.current) clearInterval(runTimerRef.current);
        setIsRunning(false);
        completeTrial(finalBubbles, fair);
      }
    }, 200);
  };

  const completeTrial = (finalBubbles: number, fair: boolean) => {
    if (!activeTeam) return;

    const newTrialNumber = teamTrials.length + 1;
    const newTrial: Trial = {
      id: `trial-${Date.now()}`,
      n: newTrialNumber,
      setup: { ...setup },
      bubbles: finalBubbles,
      changed: changedVars,
      fair: previousTrial ? fair : true, // First trial is always fair
      timestamp: Date.now(),
    };

    addTrial(activeTeam.id, newTrial);
    setLastCompletedTrial(newTrial);

    // Check for M1 Misconception:
    // If team guessed that warmth makes 'more' bubbles, and setup has 45°C
    // producing fewer bubbles than a 25°C or 35°C trial
    const tempHypothesis = activeTeam.hypotheses.find((h) => h.variable === 'temp');
    if (tempHypothesis && setup.temp === 45) {
      const lowerTempTrial = teamTrials.find(
        (t) => t.setup.temp === 25 || t.setup.temp === 35
      );
      if (lowerTempTrial && finalBubbles < lowerTempTrial.bubbles) {
        recordMisconceptionSeen(activeTeam.id, 'M1');
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <ProgressStrip />

      {/* Bench Header & Hypothesis Reminder */}
      <section className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-plant-dark bg-plant-soft px-2.5 py-1 rounded-full border border-plant/30">
            Step 2 · Virtual Lab Bench
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1">
            Test and Count Bubbles 🧪
          </h1>
        </div>

        {activeTeam?.hypotheses?.length ? (
          <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl text-sm sm:text-base max-w-md">
            <span className="font-bold text-gray-500 block text-xs uppercase">Your Guess:</span>
            <span className="font-semibold text-gray-800">
              When we increase{' '}
              <strong className="text-plant-dark">
                {activeTeam.hypotheses[activeTeam.hypotheses.length - 1].variable}
              </strong>
              , bubbles will{' '}
              <strong className="text-water-dark">
                {activeTeam.hypotheses[activeTeam.hypotheses.length - 1].direction}
              </strong>
              .
            </span>
          </div>
        ) : null}
      </section>

      {/* Fair Test Warning Modal/Card if triggered */}
      {showFairWarning && (
        <FairTestWarning
          changedVariables={changedVars}
          level={activeTeam?.level || 'sapling'}
          onGoBack={() => setShowFairWarning(false)}
          onRunAnyway={() => executeRun(false)}
        />
      )}

      {/* Main Lab Area: Left Scene (SVG), Right Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: SVG Lab Scene & Live Counter */}
        <div className="lg:col-span-7 space-y-4">
          <LabScene
            setup={setup}
            isRunning={isRunning}
            bubbleCount={isRunning ? liveBubbleCount : lastCompletedTrial ? lastCompletedTrial.bubbles : 0}
          />
          <BubbleCounter
            isRunning={isRunning}
            secondsLeft={secondsLeft}
            currentCount={isRunning ? liveBubbleCount : lastCompletedTrial ? lastCompletedTrial.bubbles : 0}
            finalCount={lastCompletedTrial ? lastCompletedTrial.bubbles : null}
          />
        </div>

        {/* Right: Variable Controls */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Lab Controls
            </h2>
            {previousTrial && (
              <span className="text-xs font-bold text-gray-500">
                Trial #{teamTrials.length + 1}
              </span>
            )}
          </div>

          {/* Changed variables chips */}
          {previousTrial && (
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-sm">
              <span className="font-bold text-gray-600 mr-2">Changed since last trial:</span>
              {changedVars.length === 0 ? (
                <span className="text-gray-500 italic">None (identical to Trial #{previousTrial.n})</span>
              ) : (
                <div className="inline-flex flex-wrap gap-1 mt-1">
                  {changedVars.map((v) => (
                    <span
                      key={v}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                    >
                      <span>{v === 'light' ? '☀️ Light' : v === 'temp' ? '🌡️ Warmth' : '🫧 Soda'}</span>
                    </span>
                  ))}
                  {changedVars.length > 1 && (
                    <span className="inline-flex items-center text-xs font-black text-alert-dark bg-alert-soft px-2 py-0.5 rounded-full">
                      ⚠️ 2+ changes
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Variable 1: Light Intensity */}
          <div className="space-y-2">
            <label className="text-base font-bold text-gray-800 flex items-center justify-between">
              <span>☀️ Light Distance:</span>
              <span className="text-sm font-semibold text-plant-dark">
                {setup.light === 0 ? 'Off' : `${setup.light}% intensity`}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {([0, 30, 60, 100] as LightLevel[]).map((val) => {
                const labels: Record<LightLevel, string> = {
                  0: 'Off',
                  30: 'Far',
                  60: 'Mid',
                  100: 'Near',
                };
                const isSelected = setup.light === val;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={isRunning}
                    onClick={() => setSetup((s) => ({ ...s, light: val }))}
                    className={`min-h-[50px] py-2 px-2 rounded-xl font-bold text-sm sm:text-base border-2 transition-all ${
                      isSelected
                        ? 'border-sun-dark bg-sun-soft text-charcoal ring-2 ring-sun shadow-sm'
                        : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                    }`}
                  >
                    {labels[val]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variable 2: Temperature / Warmth */}
          <div className="space-y-2">
            <label className="text-base font-bold text-gray-800 flex items-center justify-between">
              <span>🌡️ Water Warmth:</span>
              <span className="text-sm font-semibold text-plant-dark">{setup.temp}°C</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {([10, 25, 35, 45] as Temp[]).map((val) => {
                const isSelected = setup.temp === val;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={isRunning}
                    onClick={() => setSetup((s) => ({ ...s, temp: val }))}
                    className={`min-h-[50px] py-2 px-2 rounded-xl font-bold text-sm sm:text-base border-2 transition-all ${
                      isSelected
                        ? 'border-water-dark bg-water-soft text-charcoal ring-2 ring-water shadow-sm'
                        : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                    }`}
                  >
                    {val}°C
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variable 3: Baking Soda (CO2) Spoons */}
          <div className="space-y-2">
            <label className="text-base font-bold text-gray-800 flex items-center justify-between">
              <span>🫧 Baking Soda (CO₂):</span>
              <span className="text-sm font-semibold text-plant-dark">
                {setup.co2} spoon{setup.co2 === 1 ? '' : 's'}
              </span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {([0, 1, 2, 3] as Spoons[]).map((val) => {
                const isSelected = setup.co2 === val;
                return (
                  <button
                    key={val}
                    type="button"
                    disabled={isRunning}
                    onClick={() => setSetup((s) => ({ ...s, co2: val }))}
                    className={`min-h-[50px] py-2 px-2 rounded-xl font-bold text-sm sm:text-base border-2 transition-all ${
                      isSelected
                        ? 'border-plant-dark bg-plant-soft text-charcoal ring-2 ring-plant shadow-sm'
                        : 'border-gray-200 hover:border-gray-400 bg-white text-gray-700'
                    }`}
                  >
                    {val} 🥄
                  </button>
                );
              })}
            </div>
          </div>

          {/* Run Action */}
          <div className="pt-2">
            <BigButton
              type="button"
              disabled={isRunning}
              onClick={handleStartRunClick}
              variant="primary"
              size="large"
              className="w-full shadow-md text-xl"
              icon={isRunning ? '⏳' : '▶'}
            >
              {isRunning ? 'Measuring…' : 'Start 10s Run ▶'}
            </BigButton>
          </div>

          {/* Trial Post-Run Completion Card */}
          {lastCompletedTrial && !isRunning && (
            <div className="p-4 bg-green-50 rounded-xl border border-green-300 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-black text-green-900 text-lg">
                  Trial #{lastCompletedTrial.n} Complete!
                </span>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    lastCompletedTrial.fair
                      ? 'bg-green-200 text-green-800'
                      : 'bg-alert-soft text-alert-dark font-black'
                  }`}
                >
                  {lastCompletedTrial.fair ? '✅ Fair Test' : '⚠️ Unfair Test'}
                </span>
              </div>
              <p className="text-base text-gray-800">
                Plant produced <strong>{lastCompletedTrial.bubbles} bubbles per minute</strong>.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Link
                  to="/look"
                  className="flex-1 min-h-[48px] px-4 py-2 rounded-xl bg-plant text-white font-bold text-center flex items-center justify-center gap-2 hover:bg-plant-dark shadow-sm"
                >
                  <span>Look at Results</span>
                  <span>➔</span>
                </Link>
              </div>
            </div>
          )}

          {/* 2+ Trials Nudge */}
          {teamTrials.length >= 2 && !isRunning && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center space-y-1">
              <p className="text-sm font-bold text-water-dark">
                💡 You have run {teamTrials.length} trials! Ready to check your guess?
              </p>
              <Link
                to="/look"
                className="text-sm font-extrabold text-water-dark underline hover:text-water"
              >
                Go to Look & Think Screen ➔
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
