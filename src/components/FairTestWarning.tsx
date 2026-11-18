import React from 'react';
import { Variable, Level } from '../types';
import { BigButton } from './BigButton';
import { getFairTestExplanation } from '../lib/fairTest';

interface FairTestWarningProps {
  changedVariables: Variable[];
  level: Level;
  onGoBack: () => void;
  onRunAnyway: () => void;
}

export const FairTestWarning: React.FC<FairTestWarningProps> = ({
  changedVariables,
  level,
  onGoBack,
  onRunAnyway,
}) => {
  const isSeedling = level === 'seedling';
  const explanation = getFairTestExplanation(changedVariables, isSeedling);

  return (
    <div
      role="alert"
      className="w-full bg-alert-soft border-3 border-alert p-6 sm:p-7 rounded-2xl shadow-lg space-y-4 animate-fade-in"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl sm:text-5xl" role="img" aria-label="warning">
          ⚠️
        </span>
        <div className="space-y-1 flex-1">
          <h3 className="text-2xl sm:text-3xl font-black text-alert-dark">
            Wait! Is this a Fair Test?
          </h3>
          <p className="text-lg sm:text-xl font-bold text-gray-900 leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>

      <div className="p-3.5 bg-white rounded-xl border border-alert-light text-base sm:text-lg text-gray-700">
        💡 <strong>Scientific Rule:</strong> In a fair test, change <strong>only ONE factor</strong> at a time so you know what made the difference!
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
        <BigButton
          type="button"
          onClick={onGoBack}
          variant="outline"
          className="w-full sm:w-auto border-2 border-gray-400 font-bold"
        >
          ↩️ Go back and change ONE thing
        </BigButton>

        <BigButton
          type="button"
          onClick={onRunAnyway}
          variant="accent"
          className="w-full sm:w-auto font-bold bg-alert text-white hover:bg-alert-dark"
        >
          Run anyway ⚠️ (Unfair Test)
        </BigButton>
      </div>
    </div>
  );
};
