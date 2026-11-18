import React from 'react';
import { Trial } from '../types';

interface ResultsTableProps {
  trials: Trial[];
  highlightTrialIds?: string[];
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  trials,
  highlightTrialIds = [],
}) => {
  if (trials.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
        No trials recorded yet. Visit the Lab Bench to run your first experiment!
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-black text-lg text-gray-900 flex items-center gap-2">
          <span>📋 Trials Observation Table</span>
        </h3>
        <span className="text-xs font-bold text-gray-500">
          {trials.length} trial{trials.length === 1 ? '' : 's'} recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-base sm:text-lg">
          <thead>
            <tr className="bg-gray-100/70 text-gray-700 border-b border-gray-200 text-sm uppercase font-black">
              <th className="py-3 px-3 sm:px-4">Trial</th>
              <th className="py-3 px-3 sm:px-4">☀️ Light</th>
              <th className="py-3 px-3 sm:px-4">🌡️ Warmth</th>
              <th className="py-3 px-3 sm:px-4">🫧 Soda</th>
              <th className="py-3 px-3 sm:px-4">🫧 Bubbles/min</th>
              <th className="py-3 px-3 sm:px-4">Scientific Fair?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {trials.map((trial) => {
              const isHighlighted = highlightTrialIds.includes(trial.id);

              return (
                <tr
                  key={trial.id}
                  className={`transition-colors ${
                    isHighlighted
                      ? 'bg-amber-100 font-bold border-l-4 border-l-amber-500'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="py-3 px-3 sm:px-4 font-black text-gray-900">
                    T{trial.n}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800">
                    {trial.setup.light === 0 ? 'Off' : `${trial.setup.light}%`}
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800">
                    {trial.setup.temp}°C
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-gray-800">
                    {trial.setup.co2} sp
                  </td>
                  <td className="py-3 px-3 sm:px-4 font-black text-plant-dark text-lg">
                    {trial.bubbles}
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {trial.fair ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-300">
                        <span>✅</span>
                        <span>Fair</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 border border-orange-300">
                        <span>⚠️</span>
                        <span>Unfair</span>
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
