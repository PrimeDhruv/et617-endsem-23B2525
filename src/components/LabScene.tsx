import React from 'react';
import { Setup } from '../types';

interface LabSceneProps {
  setup: Setup;
  isRunning: boolean;
  bubbleCount: number;
}

export const LabScene: React.FC<LabSceneProps> = ({ setup, isRunning, bubbleCount }) => {
  // Lamp positioning based on light level
  // 0: Off (x = 520, gray), 30: Far (x = 520), 60: Middle (x = 440), 100: Near (x = 360)
  const lampPositions: Record<Setup['light'], number> = {
    0: 520,
    30: 520,
    60: 440,
    100: 360,
  };

  const lampGlowOpacity: Record<Setup['light'], number> = {
    0: 0,
    30: 0.25,
    60: 0.55,
    100: 0.9,
  };

  // Thermometer liquid height & color based on temperature
  const tempSettings: Record<
    Setup['temp'],
    { height: number; color: string; labelBg: string }
  > = {
    10: { height: 35, color: '#1E88E5', labelBg: '#E3F2FD' }, // Cold blue
    25: { height: 70, color: '#2E7D32', labelBg: '#E8F5E9' }, // Optimal green
    35: { height: 105, color: '#F57C00', labelBg: '#FFF3E0' }, // Warm orange
    45: { height: 140, color: '#D32F2F', labelBg: '#FFEBEE' }, // Hot red
  };

  const lampX = lampPositions[setup.light];
  const glow = lampGlowOpacity[setup.light];
  const currentTemp = tempSettings[setup.temp];

  // Dynamic rising bubbles when running
  // Generate a collection of bubble coordinates based on bubbleCount and animation
  const bubbles = isRunning && bubbleCount > 0 ? (
    <g className="animate-pulse">
      {Array.from({ length: Math.min(bubbleCount, 16) }).map((_, i) => {
        const xOffset = 210 + ((i * 19) % 80);
        const yOffset = 270 - ((i * 22) % 170);
        const r = 3 + (i % 4) * 1.5;
        return (
          <circle
            key={i}
            cx={xOffset}
            cy={yOffset}
            r={r}
            fill="#E3F2FD"
            stroke="#1E88E5"
            strokeWidth="1.5"
            opacity="0.85"
            className="transition-all duration-300"
          >
            <animate
              attributeName="cy"
              values={`${yOffset};${yOffset - 30};${yOffset - 60}`}
              dur={`${1.2 + (i % 3) * 0.4}s`}
              repeatCount="indefinite"
            />
          </circle>
        );
      })}
    </g>
  ) : null;

  return (
    <div className="w-full bg-gradient-to-b from-blue-50/50 to-white rounded-2xl border-2 border-gray-200 p-2 sm:p-4 shadow-inner flex flex-col items-center">
      <svg
        viewBox="0 0 600 400"
        className="w-full max-w-[600px] h-auto select-none"
        aria-label="Interactive Virtual Photosynthesis Lab Beaker and Apparatus"
        role="img"
      >
        <defs>
          {/* Light cone gradient from lamp to beaker */}
          <linearGradient id="lampBeam" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F9A825" stopOpacity={glow * 0.7} />
            <stop offset="100%" stopColor="#FFF59D" stopOpacity={glow * 0.15} />
          </linearGradient>

          {/* Water gradient */}
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F7FA" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.4" />
          </linearGradient>

          {/* Glass highlight */}
          <linearGradient id="glassReflection" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="20%" stopColor="#FFFFFF" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* 1. Laboratory Bench Table */}
        <rect x="20" y="340" width="560" height="20" rx="4" fill="#8D6E63" />
        <rect x="40" y="360" width="520" height="15" fill="#5D4037" />

        {/* 2. Lamp Glow Beam (if light > 0) */}
        {setup.light > 0 && (
          <polygon
            points={`${lampX + 15},160 ${lampX + 15},220 280,310 280,110`}
            fill="url(#lampBeam)"
            className="transition-all duration-500 ease-out pointer-events-none"
          />
        )}

        {/* 3. Beaker Apparatus */}
        {/* Beaker Glass Body */}
        <rect
          x="180"
          y="100"
          width="160"
          height="240"
          rx="12"
          fill="url(#waterGrad)"
          stroke="#90CAF9"
          strokeWidth="4"
        />

        {/* Water Surface Line & Meniscus */}
        <ellipse cx="260" cy="120" rx="76" ry="12" fill="#B2EBF2" opacity="0.6" />
        <ellipse
          cx="260"
          cy="120"
          rx="76"
          ry="12"
          fill="none"
          stroke="#4DD0E1"
          strokeWidth="2"
        />

        {/* Beaker Measurement Marks */}
        <line x1="184" y1="160" x2="204" y2="160" stroke="#78909C" strokeWidth="2" />
        <text x="210" y="164" fontSize="11" fill="#78909C" fontWeight="bold">300ml</text>
        <line x1="184" y1="210" x2="200" y2="210" stroke="#78909C" strokeWidth="2" />
        <line x1="184" y1="260" x2="204" y2="260" stroke="#78909C" strokeWidth="2" />
        <text x="210" y="264" fontSize="11" fill="#78909C" fontWeight="bold">150ml</text>

        {/* 4. Hydrilla Aquatic Plant */}
        <g id="hydrilla-plant">
          {/* Main central curved stem */}
          <path
            d="M260,330 Q255,270 262,210 T258,140"
            fill="none"
            stroke="#2E7D32"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {/* Plant Leaves whorls */}
          <ellipse cx="245" cy="300" rx="16" ry="6" fill="#4CAF50" transform="rotate(-25 245 300)" />
          <ellipse cx="275" cy="295" rx="16" ry="6" fill="#43A047" transform="rotate(20 275 295)" />

          <ellipse cx="242" cy="260" rx="15" ry="5" fill="#4CAF50" transform="rotate(-30 242 260)" />
          <ellipse cx="278" cy="255" rx="15" ry="5" fill="#388E3C" transform="rotate(25 278 255)" />

          <ellipse cx="246" cy="220" rx="14" ry="5" fill="#66BB6A" transform="rotate(-20 246 220)" />
          <ellipse cx="274" cy="215" rx="14" ry="5" fill="#43A047" transform="rotate(30 274 215)" />

          <ellipse cx="248" cy="175" rx="13" ry="5" fill="#81C784" transform="rotate(-15 248 175)" />
          <ellipse cx="272" cy="170" rx="13" ry="5" fill="#4CAF50" transform="rotate(20 272 170)" />

          {/* Top sprout bud */}
          <ellipse cx="258" cy="138" rx="8" ry="12" fill="#81C784" />
        </g>

        {/* 5. Inverted Funnel / Bubble Guide */}
        <polygon
          points="225,320 295,320 265,190 255,190"
          fill="#FFFFFF"
          opacity="0.15"
          stroke="#90CAF9"
          strokeWidth="1.5"
        />

        {/* 6. Dynamic Rising Bubbles */}
        {bubbles}

        {/* 7. Dissolved Baking Soda (Spoons indicator particles in water) */}
        {setup.co2 > 0 && (
          <g opacity="0.6">
            {Array.from({ length: setup.co2 * 6 }).map((_, idx) => (
              <circle
                key={`soda-${idx}`}
                cx={200 + ((idx * 23) % 110)}
                cy={280 + ((idx * 11) % 45)}
                r="2"
                fill="#FFFFFF"
                stroke="#B0BEC5"
                strokeWidth="0.5"
              />
            ))}
          </g>
        )}

        {/* 8. Thermometer in Beaker */}
        <g transform="translate(192, 130)">
          {/* Glass tube */}
          <rect x="0" y="0" width="10" height="160" rx="5" fill="#ECEFF1" stroke="#B0BEC5" strokeWidth="1.5" />
          {/* Mercury / Colored fluid column */}
          <rect
            x="2"
            y={156 - currentTemp.height}
            width="6"
            height={currentTemp.height}
            rx="3"
            fill={currentTemp.color}
            className="transition-all duration-300"
          />
          {/* Thermometer bottom bulb */}
          <circle cx="5" cy="165" r="9" fill={currentTemp.color} />
          {/* Temperature Tag */}
          <rect x="-8" y="-28" width="48" height="22" rx="6" fill={currentTemp.labelBg} stroke={currentTemp.color} strokeWidth="1.5" />
          <text x="16" y="-13" textAnchor="middle" fontSize="12" fontWeight="bold" fill={currentTemp.color}>
            {setup.temp}°C
          </text>
        </g>

        {/* 9. Movable Lamp */}
        <g
          transform={`translate(${lampX}, 130)`}
          className="transition-all duration-500 ease-out cursor-pointer"
        >
          {/* Lamp Stand */}
          <line x1="45" y1="90" x2="45" y2="210" stroke="#455A64" strokeWidth="6" />
          <polygon points="25,210 65,210 55,200 35,200" fill="#37474F" />

          {/* Lamp Arm & Hood */}
          <path d="M45,90 Q40,60 15,60" fill="none" stroke="#455A64" strokeWidth="6" strokeLinecap="round" />
          {/* Hood */}
          <path
            d="M15,40 L-15,15 L-15,105 L15,80 Z"
            fill={setup.light === 0 ? '#78909C' : '#F9A825'}
            stroke="#455A64"
            strokeWidth="3"
          />

          {/* Bulb */}
          <circle
            cx="-6"
            cy="60"
            r="16"
            fill={setup.light === 0 ? '#B0BEC5' : '#FFF9C4'}
            stroke={setup.light === 0 ? '#90A4AE' : '#F57F17'}
            strokeWidth="2"
          />

          {/* Light Status Text Badge */}
          <rect x="-5" y="105" width="55" height="22" rx="5" fill="#FFFFFF" stroke="#CFD8DC" />
          <text x="22" y="120" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#37474F">
            {setup.light === 0 ? 'OFF' : `${setup.light}%`}
          </text>
        </g>

        {/* 10. Beaker Label & CO2 Spoon Indicator */}
        <g transform="translate(260, 375)">
          <text textAnchor="middle" fontSize="13" fontWeight="bold" fill="#37474F">
            Hydrilla in water · {setup.co2} spoon{setup.co2 === 1 ? '' : 's'} baking soda (CO₂)
          </text>
        </g>
      </svg>
    </div>
  );
};
