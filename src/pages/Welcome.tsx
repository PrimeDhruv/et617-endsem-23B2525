import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../lib/storage';
import { Level, Mode } from '../types';
import { TEAMS_LIST, LEVELS_INFO } from '../data/content';
import { BigButton } from '../components/BigButton';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { createOrSelectTeam } = useAppState();

  const [mode, setMode] = useState<Mode>('class');
  const [selectedTeam, setSelectedTeam] = useState(TEAMS_LIST[0]);
  const [selectedLevel, setSelectedLevel] = useState<Level>('sapling');

  const handleStart = () => {
    if (mode === 'class') {
      createOrSelectTeam('Whole Class 🏫', '🏫', selectedLevel, 'class');
    } else {
      createOrSelectTeam(selectedTeam.name, selectedTeam.avatar, selectedLevel, 'group');
    }
    navigate('/ask');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Title & Subtitle */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-plant-soft text-plant-dark font-extrabold text-base border border-plant/30">
          <span>🔬 Virtual Science Lab</span>
          <span>·</span>
          <span>Classes 3–5</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-3">
          <span>Bubble Lab</span>
          <span className="text-5xl sm:text-6xl animate-bounce">🌱</span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 font-semibold max-w-xl mx-auto">
          What does a plant need to make its food?
        </p>
      </div>

      {/* Mode Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Class Mode Card */}
        <button
          type="button"
          onClick={() => setMode('class')}
          className={`p-6 sm:p-7 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
            mode === 'class'
              ? 'border-plant bg-white ring-4 ring-plant/20 shadow-md scale-[1.01]'
              : 'border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-4xl sm:text-5xl">📽️</span>
              {mode === 'class' && (
                <span className="bg-plant text-white px-3 py-1 rounded-full text-sm font-black uppercase">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Class Mode</h2>
            <p className="text-gray-600 text-lg">
              Teacher shows on projector screen for whole-class inquiry and group voting.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-plant font-bold text-base">
            <span>Whole Class Team (🏫)</span>
          </div>
        </button>

        {/* Group Mode Card */}
        <button
          type="button"
          onClick={() => setMode('group')}
          className={`p-6 sm:p-7 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between ${
            mode === 'group'
              ? 'border-water bg-white ring-4 ring-water/20 shadow-md scale-[1.01]'
              : 'border-gray-200 bg-white/70 hover:bg-white hover:border-gray-300'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-4xl sm:text-5xl">👥</span>
              {mode === 'group' && (
                <span className="bg-water text-white px-3 py-1 rounded-full text-sm font-black uppercase">
                  Selected
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">Group Mode</h2>
            <p className="text-gray-600 text-lg">
              Small teams share a tablet or computer to run their own experiments together.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2 text-water-dark font-bold text-base">
            <span>Choose Team Avatar & Name below</span>
          </div>
        </button>
      </div>

      {/* Group Mode Team Chooser */}
      {mode === 'group' && (
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <label className="block text-xl font-black text-gray-900">
            Choose Your Team:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEAMS_LIST.map((team) => {
              const isSelected = selectedTeam.name === team.name;
              return (
                <button
                  key={team.name}
                  type="button"
                  onClick={() => setSelectedTeam(team)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all min-h-[56px] ${
                    isSelected
                      ? 'border-water-dark bg-water-soft/50 ring-2 ring-water scale-105 shadow-sm'
                      : 'border-gray-200 hover:border-gray-400 bg-white'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl">{team.avatar}</span>
                  <span className="font-extrabold text-lg text-gray-800">{team.name}</span>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Level Chooser (Applies to both Class and Group) */}
      <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
        <label className="block text-xl font-black text-gray-900">
          Choose Learning Level:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(Object.keys(LEVELS_INFO) as Level[]).map((lvlKey) => {
            const info = LEVELS_INFO[lvlKey];
            const isSelected = selectedLevel === lvlKey;
            return (
              <button
                key={lvlKey}
                type="button"
                onClick={() => setSelectedLevel(lvlKey)}
                className={`p-4 rounded-xl border-2 text-left transition-all min-h-[56px] flex flex-col justify-between ${
                  isSelected
                    ? 'border-plant bg-plant-soft ring-2 ring-plant shadow-sm scale-102'
                    : 'border-gray-200 hover:border-gray-400 bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{info.badge}</span>
                    <span className="text-xs font-black uppercase text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                      {info.classNumber}
                    </span>
                  </div>
                  <h3 className="font-black text-xl text-gray-900 mt-2">{info.title}</h3>
                  <div className="text-sm font-bold text-plant-dark mt-0.5">{info.focus}</div>
                </div>
                <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-100">
                  {info.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Start Action */}
      <div className="text-center pt-2 space-y-4">
        <BigButton
          onClick={handleStart}
          variant="primary"
          size="large"
          className="w-full sm:w-auto shadow-lg"
          icon="🚀"
        >
          Start Inquiry Lab
        </BigButton>

        {/* Quick Links */}
        <div className="flex items-center justify-center gap-6 text-base font-bold text-gray-600">
          <Link
            to="/teacher"
            className="hover:text-plant-dark flex items-center gap-1.5 underline decoration-gray-300 hover:decoration-plant"
          >
            <span>👩‍🏫</span>
            <span>Teacher Dashboard</span>
          </Link>
          <span>·</span>
          <Link
            to="/about"
            className="hover:text-water-dark flex items-center gap-1.5 underline decoration-gray-300 hover:decoration-water"
          >
            <span>ℹ️</span>
            <span>About & Exam Card</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
