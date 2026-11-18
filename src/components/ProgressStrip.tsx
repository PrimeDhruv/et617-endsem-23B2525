import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export type StepKey = 'ask' | 'lab' | 'look' | 'check';

interface Step {
  key: StepKey;
  path: string;
  label: string;
  icon: string;
  shortLabel: string;
}

const STEPS: Step[] = [
  { key: 'ask', path: '/ask', label: '1. Ask & Guess', icon: '❓', shortLabel: 'Guess' },
  { key: 'lab', path: '/lab', label: '2. Test in Lab', icon: '🧪', shortLabel: 'Test' },
  { key: 'look', path: '/look', label: '3. Look & Think', icon: '🔍', shortLabel: 'Think' },
  { key: 'check', path: '/check', label: '4. Check & Learn', icon: '✅', shortLabel: 'Check' },
];

export const ProgressStrip: React.FC = () => {
  const location = useLocation();

  const getCurrentStepIndex = (): number => {
    const current = location.pathname;
    if (current.startsWith('/ask')) return 0;
    if (current.startsWith('/lab')) return 1;
    if (current.startsWith('/look')) return 2;
    if (current.startsWith('/check')) return 3;
    return -1;
  };

  const currentIndex = getCurrentStepIndex();

  if (currentIndex === -1) {
    return null; // Don't render on welcome, about, teacher dashboard
  }

  return (
    <nav
      aria-label="Inquiry Cycle Progress"
      className="w-full bg-white rounded-2xl border border-gray-200 p-2 sm:p-3 shadow-sm mb-6"
    >
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, idx) => {
          const isCurrent = idx === currentIndex;
          const isCompleted = idx < currentIndex;

          return (
            <React.Fragment key={step.key}>
              <li className="flex-1 text-center">
                <Link
                  to={step.path}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 py-2 sm:py-2.5 rounded-xl transition-all font-bold ${
                    isCurrent
                      ? 'bg-plant text-white shadow-sm ring-2 ring-plant-dark'
                      : isCompleted
                      ? 'bg-plant-soft text-plant-dark hover:bg-green-100'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span className="text-xl sm:text-2xl" role="img" aria-hidden="true">
                    {isCompleted ? '✓' : step.icon}
                  </span>
                  <span className="text-xs sm:text-base hidden sm:inline">{step.label}</span>
                  <span className="text-xs font-bold sm:hidden">{step.shortLabel}</span>
                </Link>
              </li>

              {idx < STEPS.length - 1 && (
                <li aria-hidden="true" className="text-gray-300 font-black text-lg select-none px-0.5">
                  ➔
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
