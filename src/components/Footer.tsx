import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-auto border-t border-gray-200 bg-white/80 backdrop-blur-sm text-center text-gray-700 font-semibold tracking-wide text-lg shadow-inner">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-plant animate-pulse"></span>
          <span>ET617 · Roll No: <strong className="text-plant-dark">23B2525</strong></span>
        </div>
        <div className="text-base text-gray-500">
          Inquiry-Based Photosynthesis Lab (Classes 3–5)
        </div>
      </div>
    </footer>
  );
};
