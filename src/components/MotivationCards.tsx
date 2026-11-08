import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Flame, 
  Wind, 
  FileCheck2, 
  Play, 
  Pause, 
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import pastPapersImg from '../assets/images/card_past_papers_1794144292794.jpg';
import consistencyImg from '../assets/images/card_study_consistency_1794144294129.jpg';
import composureImg from '../assets/images/card_mental_composure_1794144293937.jpg';

export const MotivationCards: React.FC = () => {
  // Card 1 State: Past paper checklist
  const [completedPapers, setCompletedPapers] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('vexta_completed_papers');
      return saved ? JSON.parse(saved) : { '2023_p1': true, '2023_p2': true, '2024_p1': true };
    } catch {
      return {};
    }
  });

  const years = [2020, 2021, 2022, 2023, 2024, 2025];
  const togglePaper = (key: string) => {
    const updated = { ...completedPapers, [key]: !completedPapers[key] };
    setCompletedPapers(updated);
    localStorage.setItem('vexta_completed_papers', JSON.stringify(updated));
  };

  const completedCount = Object.values(completedPapers).filter(Boolean).length;
  const totalSlots = years.length * 2;
  const pastPaperPercent = Math.round((completedCount / totalSlots) * 100);

  // Card 2 State: Daily Streak and Pledges
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('vexta_study_streak');
    return saved ? parseInt(saved, 10) : 7;
  });

  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(() => {
    const lastDate = localStorage.getItem('vexta_last_checkin_date');
    const today = new Date().toDateString();
    return lastDate === today;
  });

  const [habits, setHabits] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('vexta_daily_habits');
      return saved ? JSON.parse(saved) : { h1: true, h2: false, h3: false };
    } catch {
      return { h1: true, h2: false, h3: false };
    }
  });

  const toggleHabit = (id: string) => {
    const updated = { ...habits, [id]: !habits[id] };
    setHabits(updated);
    localStorage.setItem('vexta_daily_habits', JSON.stringify(updated));
  };

  const handleCheckIn = () => {
    if (!hasCheckedInToday) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setHasCheckedInToday(true);
      const today = new Date().toDateString();
      localStorage.setItem('vexta_study_streak', String(newStreak));
      localStorage.setItem('vexta_last_checkin_date', today);

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#38bdf8', '#fbbf24'],
        });
      } catch {
        // Fallback
      }
    }
  };

  // Card 3 State: Box Breathing Exercise (4s Inhale, 4s Hold, 4s Exhale, 4s Hold)
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [totalBreaths, setTotalBreaths] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            // Next phase
            setBreathPhase((current) => {
              if (current === 'Inhale') return 'Hold';
              if (current === 'Hold') return 'Exhale';
              if (current === 'Exhale') return 'Pause';
              setTotalBreaths((b) => b + 1);
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBreathingActive]);

  const resetBreathing = () => {
    setIsBreathingActive(false);
    setBreathPhase('Inhale');
    setBreathSeconds(4);
  };

  // Expanded tips states
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const toggleExpanded = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <section id="motivation" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2 tracking-wide uppercase">
            <span>Essential Pillars for Sri Lankan Students</span>
            <span aria-hidden="true">·</span>
            <span>A/L & O/L Preparation</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight text-balance">
            Study Motivation & Hall Discipline
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
            Theoretical knowledge alone will not secure your district rank or university seat. Cultivate these three non-negotiable mental habits every single week.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Streak: <strong className="text-white font-mono">{streak} Days</strong></span>
        </div>
      </div>

      {/* 3 Motivation Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* ================= CARD 1: Past Paper Mastery ================= */}
        <div className="bg-[#0f1627] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl group">
          <div>
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={pastPapersImg}
                alt="Past exam papers on study desk with fountain pen"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1627] via-[#0f1627]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700/50">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Pillar 01 · Rigorous Practice</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
                Mastery of Past Exam Papers
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">
                පසුගිය විභාග ප්‍රශ්න පත්‍ර සහ ලකුණු දීමේ පටිපාටිය
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Over 85% of exam problem structures and answering frameworks repeat. Reading theory notes ten times will never match the confidence of solving 10 years of past papers under a strict 3-hour timer.
              </p>

              {/* Interactive Micro-Tool: Past Paper Checkoff */}
              <div className="bg-[#141d33] border border-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-slate-300">Past Papers Completed (MCQ + Essay)</span>
                  <span className="font-mono text-amber-400 font-bold">{pastPaperPercent}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-300"
                    style={{ width: `${pastPaperPercent}%` }}
                  />
                </div>

                {/* Year pills */}
                <div className="grid grid-cols-3 gap-2">
                  {years.map((year) => {
                    const p1 = completedPapers[`${year}_p1`];
                    const p2 = completedPapers[`${year}_p2`];
                    return (
                      <div
                        key={year}
                        className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 text-center"
                      >
                        <div className="text-xs font-mono font-medium text-slate-300 mb-1.5">{year}</div>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => togglePaper(`${year}_p1`)}
                            title={`${year} Paper 1 (MCQ)`}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                              p1
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            P1
                          </button>
                          <button
                            onClick={() => togglePaper(`${year}_p2`)}
                            title={`${year} Paper 2 (Structured/Essay)`}
                            className={`text-[10px] px-1.5 py-0.5 rounded font-mono transition-colors ${
                              p2
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            P2
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible Strategy Insight */}
              {expandedCard === 1 && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed mb-4">
                  <strong className="text-amber-300 block mb-1">Official Marking Scheme Strategy:</strong>
                  Always mark your own past paper using the official Department of Examinations marking scheme with a red pen. Note down every lost half-mark in an 'Error Notebook' and re-solve it 48 hours later.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => toggleExpanded(1)}
              className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{expandedCard === 1 ? 'Hide Marking Scheme Tip' : 'View Marking Scheme Strategy'}</span>
              {expandedCard === 1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ================= CARD 2: Z-Score & Consistency ================= */}
        <div className="bg-[#0f1627] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl group">
          <div>
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={consistencyImg}
                alt="Student studying in dark quiet library with books"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1627] via-[#0f1627]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700/50">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Pillar 02 · Daily Habit Loop</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
                The Z-Score & Consistency Mindset
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">
                නිරන්තර කැපවීම සහ දෛනික පුරුදු
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                National island ranks and university selection reward quiet, unrelenting consistency. Studying 5 focused, distraction-free hours every day beats exhausting 15-hour panic sprints that leave you burned out.
              </p>

              {/* Interactive Micro-Tool: Daily Consistency Tracker */}
              <div className="bg-[#141d33] border border-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-slate-300">Daily Core Habits</span>
                  <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{streak} Day Streak</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {[
                    { id: 'h1', text: 'Active Recall & Quick Formula Sheet Review (30m)' },
                    { id: 'h2', text: '1 Hard Problem / Essay Question Solved Under Time' },
                    { id: 'h3', text: 'Reviewed Mistakes from Yesterday\'s Revision' },
                  ].map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                        habits[habit.id]
                          ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30'
                          : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          habits[habit.id] ? 'text-emerald-400' : 'text-slate-600'
                        }`}
                      />
                      <span className="line-clamp-1">{habit.text}</span>
                    </button>
                  ))}
                </div>

                {/* Check In Button */}
                <button
                  onClick={handleCheckIn}
                  disabled={hasCheckedInToday}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    hasCheckedInToday
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 active:scale-95'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{hasCheckedInToday ? '✓ Checked In for Today!' : 'Log Today\'s Study Session'}</span>
                </button>
              </div>

              {/* Collapsible Strategy Insight */}
              {expandedCard === 2 && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed mb-4">
                  <strong className="text-amber-300 block mb-1">District Z-Score Realism:</strong>
                  The Z-Score formula standardizes marks against the standard deviation. Doing well on the hardest question in the paper yields disproportionately higher standard scores than getting average questions right.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => toggleExpanded(2)}
              className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{expandedCard === 2 ? 'Hide Z-Score Formula Tip' : 'How the Z-Score Rewards You'}</span>
              {expandedCard === 2 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ================= CARD 3: Exam Hall Composure ================= */}
        <div className="bg-[#0f1627] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-300 shadow-xl group">
          <div>
            {/* Image Banner */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
              <img
                src={composureImg}
                alt="Serene study desk with bonsai and natural light"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1627] via-[#0f1627]/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs text-slate-300 font-medium bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-md border border-slate-700/50">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pillar 03 · Mental Composure</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-amber-300 transition-colors">
                Exam Hall Calm & Panic Control
              </h3>
              <p className="text-xs text-slate-400 mb-4 font-medium">
                විභාග ශාලාවේ මානසික ඒකාග්‍රතාව
              </p>
              <p className="text-sm text-slate-300 leading-relaxed mb-5">
                Every year, well-prepared students lose marks due to exam-hall anxiety. If the first question seems impossible, remember: it is difficult for all 300,000 candidates across the island. Breathe and move forward.
              </p>

              {/* Interactive Micro-Tool: 4-4-4 Box Breathing Guide */}
              <div className="bg-[#141d33] border border-slate-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-slate-300">Exam-Calm Breathing Guide</span>
                  <span className="text-cyan-400 font-mono text-[11px]">
                    {totalBreaths > 0 ? `${totalBreaths} cycles finished` : 'Box 4-4-4'}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-4 bg-slate-900/60 rounded-xl border border-slate-800/80 mb-3">
                  {/* Dynamic Pulsing Circle */}
                  <div
                    className={`w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                      breathPhase === 'Inhale'
                        ? 'scale-110 bg-cyan-500/20 border-2 border-cyan-400 text-cyan-200 shadow-lg shadow-cyan-500/20'
                        : breathPhase === 'Hold'
                        ? 'scale-110 bg-amber-500/20 border-2 border-amber-400 text-amber-200'
                        : breathPhase === 'Exhale'
                        ? 'scale-90 bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200'
                        : 'scale-90 bg-slate-800 border-2 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-xs font-bold uppercase tracking-wider">{breathPhase}</span>
                    <span className="text-lg font-mono font-extrabold">{breathSeconds}s</span>
                  </div>
                  <div className="mt-3 text-[11px] text-slate-400">
                    {isBreathingActive
                      ? 'Follow the circle rhythm to slow heart rate'
                      : 'Take 60 seconds to calm your mind before revising'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsBreathingActive(!isBreathingActive)}
                    className="flex-1 py-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isBreathingActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isBreathingActive ? 'Pause Breathing' : 'Start 1-Min Calm Cycle'}</span>
                  </button>
                  {isBreathingActive && (
                    <button
                      onClick={resetBreathing}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                      title="Reset"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Collapsible Strategy Insight */}
              {expandedCard === 3 && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-xs text-amber-200/90 leading-relaxed mb-4">
                  <strong className="text-amber-300 block mb-1">The 10-Minute Reading Time Rule:</strong>
                  In Sri Lankan exams, you get 10 minutes before writing begins. Never calculate numbers during this time. Scan the entire paper, mark the 4 questions you will attempt first, and arrange them by highest personal comfort.
                </div>
              )}
            </div>
          </div>

          {/* Footer Action */}
          <div className="px-6 pb-6 pt-2">
            <button
              onClick={() => toggleExpanded(3)}
              className="w-full py-2.5 px-3 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{expandedCard === 3 ? 'Hide 10-Minute Reading Tip' : 'How to Use 10-Min Reading Time'}</span>
              {expandedCard === 3 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
