import React from 'react';
import { Trial } from '../types';

interface BarChartProps {
  trials: Trial[];
  onSelectBar?: (trialId: string, trialNumber: number, bubbles: number) => void;
  selectedBarTrialId?: string;
  isInteractive?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  trials,
  onSelectBar,
  selectedBarTrialId,
  isInteractive = false,
}) => {
  if (trials.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 bg-white rounded-2xl border border-gray-200">
        Bar chart will appear here after you run trials in the lab.
      </div>
    );
  }

  // Dimensions
  const chartHeight = 240;
  const chartWidth = Math.max(500, trials.length * 80 + 80);
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;

  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const innerWidth = chartWidth - paddingLeft - paddingRight;

  const maxBubbles = Math.max(20, ...trials.map((t) => t.bubbles));
  const barWidth = Math.min(48, Math.max(28, (innerWidth / trials.length) * 0.6));
  const stepX = innerWidth / trials.length;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-2 overflow-x-auto">
      <div className="flex items-center justify-between text-sm">
        <h4 className="font-black text-gray-900 text-base">
          📊 Oxygen Bubble Production per Trial
        </h4>
        <div className="flex items-center gap-3 text-xs font-bold text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-plant inline-block"></span>
            <span>Fair Trial</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded bg-alert unfair-stripe border border-alert inline-block"></span>
            <span>Unfair (⚠️ 2+ changes)</span>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto min-w-[480px] select-none"
        role="img"
        aria-label="Bar chart showing oxygen bubbles per minute for each experiment trial"
      >
        <defs>
          {/* Diagonal stripes for unfair tests */}
          <pattern
            id="unfairStripe"
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <rect width="4" height="8" fill="#EF6C00" />
            <rect x="4" width="4" height="8" fill="#FFF3E0" />
          </pattern>
        </defs>

        {/* Y-axis gridlines */}
        {[0, 5, 10, 15, 20].map((val) => {
          if (val > maxBubbles + 2) return null;
          const y = paddingTop + innerHeight - (val / maxBubbles) * innerHeight;
          return (
            <g key={`grid-${val}`}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={chartWidth - paddingRight}
                y2={y}
                stroke="#ECEFF1"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#78909C"
                fontWeight="bold"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Baseline (X-axis) */}
        <line
          x1={paddingLeft}
          y1={paddingTop + innerHeight}
          x2={chartWidth - paddingRight}
          y2={paddingTop + innerHeight}
          stroke="#455A64"
          strokeWidth="2"
        />

        {/* Bars */}
        {trials.map((trial, idx) => {
          const x = paddingLeft + idx * stepX + (stepX - barWidth) / 2;
          const barHeight = (trial.bubbles / maxBubbles) * innerHeight;
          const y = paddingTop + innerHeight - barHeight;
          const isSelected = selectedBarTrialId === trial.id;

          const barFill = trial.fair ? '#2E7D32' : 'url(#unfairStripe)';
          const strokeColor = trial.fair ? '#1B5E20' : '#E65100';

          return (
            <g
              key={trial.id}
              onClick={() => {
                if (onSelectBar) {
                  onSelectBar(trial.id, trial.n, trial.bubbles);
                }
              }}
              className={isInteractive ? 'cursor-pointer hover:opacity-90' : ''}
              role={isInteractive ? 'button' : undefined}
              tabIndex={isInteractive ? 0 : undefined}
              aria-label={`Trial ${trial.n}: ${trial.bubbles} bubbles per minute`}
            >
              {/* Highlight selection ring if chosen in interactive task */}
              {isSelected && (
                <rect
                  x={x - 4}
                  y={y - 4}
                  width={barWidth + 8}
                  height={barHeight + 8}
                  rx="8"
                  fill="none"
                  stroke="#1E88E5"
                  strokeWidth="3"
                />
              )}

              {/* Bar Rect */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(4, barHeight)}
                rx="6"
                fill={barFill}
                stroke={strokeColor}
                strokeWidth="1.5"
                className="transition-all duration-300"
              />

              {/* Number of bubbles on top of bar */}
              <text
                x={x + barWidth / 2}
                y={Math.max(16, y - 6)}
                textAnchor="middle"
                fontSize="13"
                fontWeight="900"
                fill="#263238"
              >
                {trial.bubbles}
              </text>

              {/* Trial Label at Bottom */}
              <text
                x={x + barWidth / 2}
                y={paddingTop + innerHeight + 20}
                textAnchor="middle"
                fontSize="13"
                fontWeight="bold"
                fill={isSelected ? '#1565C0' : '#455A64'}
              >
                T{trial.n}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
