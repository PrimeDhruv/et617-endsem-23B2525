import React from 'react';

interface BubbleCounterProps {
  isRunning: boolean;
  secondsLeft: number;
  currentCount: number;
  finalCount: number | null;
}

export const BubbleCounter: React.FC<BubbleCounterProps> = ({
  isRunning,
  secondsLeft,
  currentCount,
  finalCount,
}) => {
  const percentComplete = ((10 - secondsLeft) / 10) * 100;

  return (
    <div
      aria-live="polite"
      className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Status & Counter */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-water-soft border-2 border-water flex items-center justify-center text-3xl shadow-inner">
          <span className={isRunning ? 'animate-bounce' : ''}>🫧</span>
        </div>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {isRunning ? 'Counting oxygen bubbles (10s run)…' : 'Trial Observation'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-2">
            <span>{currentCount}</span>
            <span className="text-lg font-bold text-gray-500">bubbles / min</span>
          </div>
        </div>
      </div>

      {/* Progress & Countdown */}
      {isRunning ? (
        <div className="w-full sm:w-64 space-y-2">
          <div className="flex justify-between text-sm font-bold text-gray-600">
            <span>⏱️ Timer: {secondsLeft}s left</span>
            <span>{Math.round(percentComplete)}%</span>
          </div>
          <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
            <div
              className="h-full bg-water transition-all duration-300 rounded-full"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      ) : finalCount !== null ? (
        <div className="text-right">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-900 font-bold text-sm border border-green-300">
            <span>✓</span>
            <span>Measurement complete!</span>
          </span>
        </div>
      ) : (
        <div className="text-gray-500 text-sm font-semibold">
          Press <strong>Start Run ▶</strong> to measure bubbles.
        </div>
      )}
    </div>
  );
};
