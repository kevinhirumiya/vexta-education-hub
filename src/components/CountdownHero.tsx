import React, { useState, useEffect } from 'react';
import { Calendar, Edit3, Check, RefreshCw, Sparkles, BookOpen, Clock } from 'lucide-react';
import type { ExamType, ALStream, TimeLeft } from '../types';

interface CountdownHeroProps {
  currentExamType: ExamType;
  onExamTypeChange: (type: ExamType) => void;
  selectedStream: ALStream;
  onStreamChange: (stream: ALStream) => void;
  onOpenFocus: () => void;
}

export const CountdownHero: React.FC<CountdownHeroProps> = ({
  currentExamType,
  onExamTypeChange,
  selectedStream,
  onStreamChange,
  onOpenFocus,
}) => {
  // Preset dates
  const defaultDates = {
    AL_2026: '2026-12-01T08:30:00',
    AL_2027: '2027-08-16T08:30:00',
    OL_2027: '2027-05-17T08:30:00',
  };

  // State initialization with localStorage preservation
  const [targetDateString, setTargetDateString] = useState<string>(() => {
    const saved = localStorage.getItem('vexta_target_exam_date');
    if (saved) return saved;
    return currentExamType === 'AL' ? defaultDates.AL_2026 : defaultDates.OL_2027;
  });

  const [studyHoursPerDay, setStudyHoursPerDay] = useState<number>(() => {
    const saved = localStorage.getItem('vexta_daily_study_goal');
    return saved ? parseInt(saved, 10) : 6;
  });

  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDate, setTempDate] = useState(targetDateString);

  // Calculate time remaining
  const calculateTimeLeft = (targetStr: string): TimeLeft => {
    const target = new Date(targetStr).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        totalSeconds: 0,
        totalDays: 0,
        totalHours: 0,
        totalWeeks: 0,
        isPast: true,
      };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      days,
      hours,
      minutes,
      seconds,
      totalSeconds,
      totalDays: days,
      totalHours: Math.floor(totalSeconds / 3600),
      totalWeeks: Math.floor(days / 7),
      isPast: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(targetDateString));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDateString));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDateString]);

  const handleSaveDate = () => {
    if (tempDate) {
      setTargetDateString(tempDate);
      localStorage.setItem('vexta_target_exam_date', tempDate);
      setIsEditingDate(false);
    }
  };

  const handlePresetSelect = (presetKey: 'AL_2026' | 'AL_2027' | 'OL_2027') => {
    const newDate = defaultDates[presetKey];
    setTargetDateString(newDate);
    setTempDate(newDate);
    localStorage.setItem('vexta_target_exam_date', newDate);
    if (presetKey.startsWith('AL')) {
      onExamTypeChange('AL');
    } else {
      onExamTypeChange('OL');
    }
  };

  const formattedTargetDate = new Date(targetDateString).toLocaleDateString('en-LK', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const streamNames: Record<ALStream, string> = {
    physical_science: 'Physical Science (Maths)',
    biological_science: 'Biological Science (Bio)',
    commerce: 'Commerce & Management',
    technology: 'Technology (ET/BST/SFT)',
    arts: 'Arts & Humanities',
  };

  // Study hours total
  const estimatedStudyHours = Math.max(0, timeLeft.totalDays * studyHoursPerDay);

  return (
    <section id="countdown" className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Background glow ambiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-b from-amber-500/10 via-cyan-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Hero Header & Context Metadata */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mb-4 tracking-wide uppercase">
          <span>Sri Lanka National Examinations</span>
          <span aria-hidden="true">·</span>
          <span>Official Countdown</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-400">Target Session 2026–2027</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 text-balance">
          Every Second Brings You Closer to Your Dream Z-Score.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          The decisive battlefield for Sri Lankan students. Track the remaining days, discipline your revision timetable, and convert anxious energy into past paper marks.
        </p>

        {/* Interactive Segmented Exam Control */}
        <div className="mt-8 inline-flex items-center p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl shadow-inner gap-1">
          <button
            onClick={() => {
              onExamTypeChange('AL');
              handlePresetSelect('AL_2026');
            }}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentExamType === 'AL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            G.C.E. Advanced Level (A/L)
          </button>
          <button
            onClick={() => {
              onExamTypeChange('OL');
              handlePresetSelect('OL_2027');
            }}
            className={`px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
              currentExamType === 'OL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            G.C.E. Ordinary Level (O/L)
          </button>
        </div>
      </div>

      {/* Main Countdown Display Container */}
      <div className="relative bg-[#0d1322]/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl max-w-5xl mx-auto">
        {/* Top bar inside timer container: Exam info & Date adjust */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-800/80 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
              <Sparkles className="w-4 h-4" />
              <span>
                {currentExamType === 'AL'
                  ? `G.C.E. A/L — ${streamNames[selectedStream]}`
                  : 'G.C.E. O/L — 9 A\'s Target Examination'}
              </span>
            </div>
            <div className="text-sm text-slate-300 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Exam Commences: <strong className="text-white font-medium">{formattedTargetDate}</strong></span>
            </div>
          </div>

          {/* Quick preset selector & Custom date button */}
          <div className="flex flex-wrap items-center gap-2">
            {currentExamType === 'AL' ? (
              <>
                <button
                  onClick={() => handlePresetSelect('AL_2026')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
                >
                  A/L 2026 (Dec)
                </button>
                <button
                  onClick={() => handlePresetSelect('AL_2027')}
                  className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
                >
                  A/L 2027 (Aug)
                </button>
              </>
            ) : (
              <button
                onClick={() => handlePresetSelect('OL_2027')}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors whitespace-nowrap shrink-0 border border-slate-700/60"
              >
                O/L 2027 (May)
              </button>
            )}

            <button
              onClick={() => setIsEditingDate(!isEditingDate)}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              title="Set custom exam target date"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingDate ? 'Close Editor' : 'Custom Date'}</span>
            </button>
          </div>
        </div>

        {/* Date editor drawer if active */}
        {isEditingDate && (
          <div className="mb-8 p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex-1 w-full sm:w-auto">
              <label htmlFor="exam-datetime" className="block text-xs font-medium text-slate-300 mb-1.5">
                Set Exact Timetable Date & Time for Your Exam:
              </label>
              <input
                id="exam-datetime"
                type="datetime-local"
                value={tempDate.slice(0, 16)}
                onChange={(e) => setTempDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={handleSaveDate}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Apply Date</span>
              </button>
              <button
                onClick={() => setIsEditingDate(false)}
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Big Countdown Digits Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Days */}
          <div className="bg-[#121a2d] border border-slate-800 rounded-2xl p-5 sm:p-7 text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-300 opacity-80" />
            <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {String(timeLeft.days).padStart(2, '0')}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-amber-400 uppercase tracking-wider">
              Days Remaining
            </div>
          </div>

          {/* Hours */}
          <div className="bg-[#121a2d] border border-slate-800 rounded-2xl p-5 sm:p-7 text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-cyan-400 opacity-60" />
            <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Hours
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-[#121a2d] border border-slate-800 rounded-2xl p-5 sm:p-7 text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-60" />
            <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white font-mono tabular-nums tracking-tight">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">
              Minutes
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-[#121a2d] border border-slate-800 rounded-2xl p-5 sm:p-7 text-center relative overflow-hidden group hover:border-amber-500/40 transition-colors shadow-lg">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-amber-400 opacity-80" />
            <div className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-amber-400 font-mono tabular-nums tracking-tight">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
            <div className="mt-2 text-xs sm:text-sm font-semibold text-amber-400/80 uppercase tracking-wider">
              Seconds
            </div>
          </div>
        </div>

        {/* Secondary Quantitative Study Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-slate-300">
          <div className="bg-[#101726]/60 rounded-xl p-4 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400">Total Weeks Left</div>
                <div className="text-lg font-bold text-white font-mono tabular-nums">
                  {timeLeft.totalWeeks} Weeks
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500">~{Math.round(timeLeft.totalWeeks * 7)} d</span>
          </div>

          <div className="bg-[#101726]/60 rounded-xl p-4 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-xs text-slate-400">Total Hours Left</div>
                <div className="text-lg font-bold text-white font-mono tabular-nums">
                  {timeLeft.totalHours.toLocaleString()} hrs
                </div>
              </div>
            </div>
            <span className="text-xs text-slate-500">24h clock</span>
          </div>

          <div className="bg-[#101726]/60 rounded-xl p-4 border border-slate-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-xs text-slate-400">Est. Study Hours ({studyHoursPerDay}h/day)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
                  {estimatedStudyHours.toLocaleString()} hrs
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                const next = studyHoursPerDay >= 10 ? 4 : studyHoursPerDay + 2;
                setStudyHoursPerDay(next);
                localStorage.setItem('vexta_daily_study_goal', String(next));
              }}
              className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
              title="Click to adjust daily study pace"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{studyHoursPerDay}h</span>
            </button>
          </div>
        </div>

        {/* Stream Selector for A/L or Action CTA */}
        {currentExamType === 'AL' && (
          <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400 font-medium">Select Your A/L Stream:</div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  ['physical_science', 'Physical Science (Maths)'],
                  ['biological_science', 'Bio Science'],
                  ['commerce', 'Commerce'],
                  ['technology', 'Technology'],
                  ['arts', 'Arts'],
                ] as const
              ).map(([streamKey, streamLabel]) => (
                <button
                  key={streamKey}
                  onClick={() => onStreamChange(streamKey)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    selectedStream === streamKey
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {streamLabel}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
