import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Waves, 
  Radio, 
  CheckCircle,
  Timer as TimerIcon
} from 'lucide-react';
import { audioSynth } from '../utils/audio';

interface FocusZoneProps {
  onSessionComplete?: () => void;
}

export const FocusZone: React.FC<FocusZoneProps> = ({ onSessionComplete }) => {
  const modes = [
    { label: 'Pomodoro (25m)', minutes: 25 },
    { label: 'Paper Sprint (50m)', minutes: 50 },
    { label: 'Quick Break (5m)', minutes: 5 },
    { label: 'Deep Rest (15m)', minutes: 15 },
  ];

  const [activeModeIndex, setActiveModeIndex] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<number>(() => {
    const saved = localStorage.getItem('vexta_completed_sessions');
    return saved ? parseInt(saved, 10) : 3;
  });

  // Ambient sound states
  const [ambientType, setAmbientType] = useState<'rain' | 'tone' | 'whitenoise' | null>(null);
  const [ambientVolume, setAmbientVolume] = useState(0.25);

  // Timer loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Completed!
            audioSynth.playChime();
            setIsRunning(false);
            setCompletedSessions((c) => {
              const updated = c + 1;
              localStorage.setItem('vexta_completed_sessions', String(updated));
              return updated;
            });
            if (onSessionComplete) onSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onSessionComplete]);

  const selectMode = (index: number) => {
    setActiveModeIndex(index);
    const secs = modes[index].minutes * 60;
    setTotalSeconds(secs);
    setSecondsRemaining(secs);
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
  };

  const toggleAmbient = (type: 'rain' | 'tone' | 'whitenoise') => {
    if (ambientType === type) {
      audioSynth.stopAmbient();
      setAmbientType(null);
    } else {
      audioSynth.startAmbient(type, ambientVolume);
      setAmbientType(type);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setAmbientVolume(newVol);
    audioSynth.setAmbientVolume(newVol);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const progressPercent = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return (
    <section id="focus" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-b from-[#0f172a] to-[#0b0f19] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        {/* Header inside Focus Zone */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-8 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5 uppercase tracking-wide">
              <TimerIcon className="w-4 h-4" />
              <span>Deep Work Station</span>
              <span aria-hidden="true">·</span>
              <span>Distraction-Free Focus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              A/L & O/L Sprint Focus Timer
            </h2>
          </div>

          {/* Sessions logged */}
          <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs self-start sm:self-auto">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              Completed Today: <strong className="text-white font-mono">{completedSessions} Sprints</strong>
            </span>
          </div>
        </div>

        {/* Main Grid: Left Timer, Right Ambient Sounds */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Timer Clock */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Mode selection tabs */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-8">
              {modes.map((m, idx) => (
                <button
                  key={m.label}
                  onClick={() => selectMode(idx)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 ${
                    activeModeIndex === idx
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Big Clock Display */}
            <div className="relative flex flex-col items-center justify-center w-64 h-64 sm:w-72 sm:h-72 rounded-full border-4 border-slate-800/80 bg-slate-950/60 shadow-2xl mb-8 group">
              {/* Circular progress highlight */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="3"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>

              <div className="text-5xl sm:text-6xl font-extrabold text-white font-mono tabular-nums tracking-tight">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                {isRunning ? 'Sprint In Progress' : 'Ready to Focus'}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-95 flex items-center gap-2 whitespace-nowrap shrink-0"
              >
                {isRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isRunning ? 'Pause Sprint' : 'Start Focus Sprint'}</span>
              </button>
              <button
                onClick={resetTimer}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors border border-slate-700/60"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Built-in Calming Ambient Study Sounds */}
          <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Waves className="w-4 h-4 text-cyan-400" />
                <span>Ambient Study Atmosphere</span>
              </h3>
              {ambientType && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Playing Audio
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Blocks intrusive household noise and street traffic across Sri Lanka. Uses pure client-side mathematical sound synthesis.
            </p>

            {/* Ambient Sound Toggles */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => toggleAmbient('rain')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  ambientType === 'rain'
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CloudRain className={`w-5 h-5 ${ambientType === 'rain' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="text-xs font-bold">Monsoon Gentle Rain</div>
                    <div className="text-[11px] text-slate-400">Rhythmic rainfall texture for deep reading</div>
                  </div>
                </div>
                <span className="text-xs font-mono">{ambientType === 'rain' ? 'Active' : 'Play'}</span>
              </button>

              <button
                onClick={() => toggleAmbient('tone')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  ambientType === 'tone'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className={`w-5 h-5 ${ambientType === 'tone' ? 'text-amber-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="text-xs font-bold">432 Hz Solfeggio Focus Tone</div>
                    <div className="text-[11px] text-slate-400">Alpha wave resonance for mathematical reasoning</div>
                  </div>
                </div>
                <span className="text-xs font-mono">{ambientType === 'tone' ? 'Active' : 'Play'}</span>
              </button>

              <button
                onClick={() => toggleAmbient('whitenoise')}
                className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${
                  ambientType === 'whitenoise'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Waves className={`w-5 h-5 ${ambientType === 'whitenoise' ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <div className="text-left">
                    <div className="text-xs font-bold">Smooth Pink & White Noise</div>
                    <div className="text-[11px] text-slate-400">Full acoustic dampening against chatter</div>
                  </div>
                </div>
                <span className="text-xs font-mono">{ambientType === 'whitenoise' ? 'Active' : 'Play'}</span>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {ambientVolume > 0 ? (
                <Volume2 className="w-4 h-4 text-slate-400 shrink-0" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500 shrink-0" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                aria-label="Ambient volume slider"
              />
              <span className="text-xs font-mono text-slate-400 shrink-0 w-8 text-right">
                {Math.round(ambientVolume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
