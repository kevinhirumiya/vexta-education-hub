/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Header } from './components/Header';
import { CountdownHero } from './components/CountdownHero';
import { MotivationCards } from './components/MotivationCards';
import { FocusZone } from './components/FocusZone';
import { SyllabusTracker } from './components/SyllabusTracker';
import { Footer } from './components/Footer';
import type { ExamType, ALStream } from './types';

export default function App() {
  const [examType, setExamType] = useState<ExamType>(() => {
    const saved = localStorage.getItem('vexta_exam_type');
    return (saved as ExamType) || 'AL';
  });

  const [stream, setStream] = useState<ALStream>(() => {
    const saved = localStorage.getItem('vexta_al_stream');
    return (saved as ALStream) || 'physical_science';
  });

  const [isFocusTimerActive, setIsFocusTimerActive] = useState(false);

  const handleExamTypeChange = (newType: ExamType) => {
    setExamType(newType);
    localStorage.setItem('vexta_exam_type', newType);
  };

  const handleStreamChange = (newStream: ALStream) => {
    setStream(newStream);
    localStorage.setItem('vexta_al_stream', newStream);
  };

  const handleScrollToFocus = () => {
    const el = document.getElementById('focus');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsFocusTimerActive(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e17] text-slate-100 flex flex-col font-sans selection:bg-amber-500/25 selection:text-amber-200">
      {/* Clean Top Navigation Bar */}
      <Header
        onOpenTimer={handleScrollToFocus}
        isTimerActive={isFocusTimerActive}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* Big Countdown Timer Section */}
        <CountdownHero
          currentExamType={examType}
          onExamTypeChange={handleExamTypeChange}
          selectedStream={stream}
          onStreamChange={handleStreamChange}
          onOpenFocus={handleScrollToFocus}
        />

        {/* Section with 3 Study Motivation Cards */}
        <MotivationCards />

        {/* Integrated Sprint Focus Station & Ambient Audio */}
        <FocusZone onSessionComplete={() => setIsFocusTimerActive(false)} />

        {/* High-Yield Revision Matrix for Sri Lankan Exams */}
        <SyllabusTracker examType={examType} stream={stream} />
      </main>

      {/* Clean Footer */}
      <Footer />
    </div>
  );
}
