import React from 'react';
import { Link } from 'react-router-dom';

export const Welcome: React.FC = () => {
  return (
    <div className="text-center py-12 space-y-6">
      <h1 className="text-4xl sm:text-5xl font-black text-plant-dark">Bubble Lab 🌱</h1>
      <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto">
        What does a plant need to make its food?
      </p>
      <div className="pt-6">
        <Link
          to="/about"
          className="min-h-touch inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-plant text-white font-bold text-xl hover:bg-plant-dark shadow-md"
        >
          View About Screen & Exam Card
        </Link>
      </div>
    </div>
  );
};
