import React from 'react';
import { Timer } from 'lucide-react';

interface HeaderProps {
  onOpenTimer: () => void;
  isTimerActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenTimer, isTimerActive = false }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0a0e17]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand title wordmark */}
        <a
          href="#"
          className="text-lg font-bold tracking-tight text-white hover:text-amber-400 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400/50" />
          <span>Vexta Study Hub</span>
        </a>

        {/* Zone 2: 4-5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a
            href="#countdown"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-400/60 underline-offset-8"
          >
            Exam Countdown
          </a>
          <a
            href="#motivation"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-400/60 underline-offset-8"
          >
            Study Motivation
          </a>
          <a
            href="#focus"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-400/60 underline-offset-8"
          >
            Focus Zone
          </a>
          <a
            href="#syllabus"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 hover:underline decoration-amber-400/60 underline-offset-8"
          >
            Revision Matrix
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            onClick={onOpenTimer}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 whitespace-nowrap shrink-0 shadow-sm ${
              isTimerActive
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 ring-2 ring-amber-400/40'
                : 'bg-slate-800 text-slate-100 hover:bg-slate-700 hover:text-white border border-slate-700/80'
            }`}
          >
            <Timer className="w-4 h-4 text-amber-400" />
            <span>{isTimerActive ? 'Active Focus' : 'Start Focus (25m)'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
