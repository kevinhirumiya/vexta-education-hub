import React from 'react';
import { Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#080c14] border-t border-slate-800/80 py-12 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-white font-bold text-base mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Vexta Study Hub</span>
          </div>
          <p className="text-xs text-slate-400 max-w-md">
            Dedicated to Sri Lankan students preparing for G.C.E. A/L and O/L examinations. Built for quiet discipline, past paper mastery, and academic triumph.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Believe in your preparation. Focus on today.</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Engineered with care for Sri Lankan learners</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
