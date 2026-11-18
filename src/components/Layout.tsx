import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Footer } from './Footer';
import { Team } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTeam?: Team | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTeam }) => {
  const location = useLocation();
  const isTeacherRoute = location.pathname.startsWith('/teacher');

  const levelBadges = {
    seedling: { label: '🌱 Seedling (Cl. 3)', bg: 'bg-green-100 text-green-800 border-green-300' },
    sapling: { label: '🌿 Sapling (Cl. 4)', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    tree: { label: '🌳 Tree (Cl. 5)', bg: 'bg-teal-100 text-teal-800 border-teal-300' },
  };

  return (
    <div className="min-h-screen flex flex-col bg-labBg text-charcoal font-sans antialiased">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-water-dark text-white px-4 py-2 rounded-lg z-50 shadow-lg text-lg"
      >
        Skip to main content
      </a>

      {/* Top Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 text-2xl md:text-3xl font-extrabold text-plant-dark hover:opacity-90 transition-opacity focus-visible:ring-2 focus-visible:ring-plant rounded-lg px-1"
              aria-label="Bubble Lab home"
            >
              <span className="text-3xl" role="img" aria-label="sprout">🌱</span>
              <span>Bubble Lab</span>
            </Link>

            {/* Active Team / Mode Chip */}
            {activeTeam && (
              <div className="hidden sm:flex items-center gap-2 ml-2 pl-3 border-l border-gray-300 text-base">
                <span className="font-bold flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-full text-gray-800 border border-gray-200">
                  <span>{activeTeam.avatar}</span>
                  <span>{activeTeam.name}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-semibold border ${levelBadges[activeTeam.level].bg}`}>
                  {levelBadges[activeTeam.level].label}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-blue-50 text-water-dark border border-blue-200">
                  {activeTeam.mode === 'class' ? '📽️ Class' : '👥 Group'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Nav Actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/about"
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-lg font-bold border transition-colors flex items-center gap-1.5 ${
                location.pathname === '/about'
                  ? 'bg-water-soft text-water-dark border-water'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
              }`}
              aria-label="About the project"
            >
              <span>ℹ️</span>
              <span className="hidden sm:inline">About</span>
            </Link>

            <Link
              to="/teacher"
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-lg font-bold border transition-colors flex items-center gap-1.5 ${
                isTeacherRoute
                  ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-sm'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border-amber-300'
              }`}
              aria-label="Teacher Dashboard"
            >
              <span>👩‍🏫</span>
              <span>Teacher</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Standard Footnote */}
      <Footer />
    </div>
  );
};
