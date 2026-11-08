import React, { useState } from 'react';
import { CheckSquare, Square, BarChart3, RotateCcw } from 'lucide-react';
import type { ExamType, ALStream } from '../types';

interface SyllabusTrackerProps {
  examType: ExamType;
  stream: ALStream;
}

interface StreamTopicData {
  subjects: {
    name: string;
    topics: string[];
  }[];
}

export const SyllabusTracker: React.FC<SyllabusTrackerProps> = ({ examType, stream }) => {
  // Topic database for Sri Lankan syllabus
  const alCurriculum: Record<ALStream, StreamTopicData> = {
    physical_science: {
      subjects: [
        {
          name: 'Combined Mathematics',
          topics: [
            'Pure Maths: Polynomials & Quadratics',
            'Pure Maths: Trigonometry & Identities',
            'Pure Maths: Limits, Differentiation & Maxima/Minima',
            'Pure Maths: Integration & Definite Integrals',
            'Applied Maths: Statics & Friction Equilibrium',
            'Applied Maths: Newton\'s Laws & Rectilinear Motion',
            'Applied Maths: Projectiles & Circular Motion',
            'Applied Maths: Probability & Statistics',
          ],
        },
        {
          name: 'Physics',
          topics: [
            'Measurement & Vernier / Micrometer Gauges',
            'Mechanics: Moment of Inertia & Energy Conservation',
            'Waves & Vibrations: Doppler Effect & Resonance',
            'Thermal Physics: Heat Engines & Radiation Laws',
            'Gravitational, Electric & Magnetic Fields',
            'Current Electricity & Kirchhoff\'s Circuit Laws',
            'Electronics: Operational Amplifiers & Logic Gates',
            'Matter & Radiation: Quantum & Nuclear Decay',
          ],
        },
        {
          name: 'Chemistry',
          topics: [
            'Atomic Structure & Periodic Trends',
            'Chemical Bonding & Hybridization (VSEPR)',
            'Gaseous State & Dalton / Real Gases',
            'Thermodynamics & Hess\'s Law / Born-Haber',
            'Chemical & Ionic Equilibrium (pH, Buffers, Ksp)',
            'Inorganic Chemistry (s, p, and d block chemistry)',
            'Organic Chemistry: Reaction Mechanisms & Hydrocarbons',
            'Industrial & Environmental Chemistry in Sri Lanka',
          ],
        },
      ],
    },
    biological_science: {
      subjects: [
        {
          name: 'Biology',
          topics: [
            'Cellular Organization & Macromolecules',
            'Evolution & Biodiversity of Organisms',
            'Plant Anatomy, Water Potential & Transport',
            'Animal Form & Function: Human Digestion & Respiration',
            'Nervous Coordination & Endocrine Control',
            'Genetics & Mendelian Ratios / Pedigree Analysis',
            'Recombinant DNA Technology & PCR',
            'Environmental Biology & Sri Lankan Ecosystems',
          ],
        },
        {
          name: 'Chemistry',
          topics: [
            'Chemical Equilibrium & Acid-Base Titrations',
            'Organic Chemistry: Carbonyls, Amines & Polymers',
            'Electrochemistry & Galvanic Cells',
            'Kinetics: Rate Equations & Arrhenius Model',
          ],
        },
        {
          name: 'Physics / Agricultural Science',
          topics: [
            'Mechanics & Hydrostatics (Surface Tension, Bernoulli)',
            'Geometrical Optics & Human Eye Defects',
            'Nuclear Physics & Radioactivity in Medicine',
            'Soil Science, Plant Nutrition & Agronomy',
          ],
        },
      ],
    },
    commerce: {
      subjects: [
        {
          name: 'Accounting',
          topics: [
            'Framework for the Preparation of Financial Statements',
            'Partnership Accounts & Goodwill Adjustments',
            'Limited Liability Company Accounts',
            'Cash Flow Statements (LKAS 7)',
            'Costing & Marginal / Absorption Analysis',
            'Financial Ratio Analysis & Performance Evaluation',
          ],
        },
        {
          name: 'Business Studies',
          topics: [
            'Business Environment & Ethical Responsibility',
            'Management Principles & Leadership Styles',
            'Marketing Mix: 4Ps and Modern E-Commerce',
            'Financial Management & Capital Budgeting',
            'Human Resource Planning & Sri Lankan Labor Laws',
          ],
        },
        {
          name: 'Economics',
          topics: [
            'Price Mechanism, Elasticity & Market Equilibrium',
            'Market Structures: Perfect Competition to Monopoly',
            'Macroeconomic Indicators: GDP, Inflation & Unemployment',
            'Fiscal Policy, Central Bank & Monetary Management',
            'International Trade, Exchange Rates & BoP Balance',
          ],
        },
      ],
    },
    technology: {
      subjects: [
        {
          name: 'Engineering / Bio-Tech (ET / BST)',
          topics: [
            'Civil & Mechanical Workshop Technology',
            'Basic Electricity & Magnetism',
            'Electronics, Sensors & Microcontrollers',
            'Material Science & Engineering Drawing (CAD)',
          ],
        },
        {
          name: 'Science for Technology (SFT)',
          topics: [
            'Applied Mechanics & Fluid Systems',
            'Chemical Energy & Industrial Processes',
            'Plant & Animal Biology for Agriculture',
            'Environmental Conservation & Energy Audits',
          ],
        },
        {
          name: 'Information & Communication Tech (ICT)',
          topics: [
            'Data Representation: Binary, Hex & Logic Gates',
            'Computer Architecture & Operating Systems',
            'Networking, IP Addressing & Cyber Security',
            'Database Systems: SQL & ER Diagrams',
            'Python Programming & Algorithm Analysis',
            'Web Development: HTML, CSS & Client-Side Scripts',
          ],
        },
      ],
    },
    arts: {
      subjects: [
        {
          name: 'Core Arts & Humanities',
          topics: [
            'National & World History',
            'Political Science: Governance & Constitutional Frameworks',
            'Logic & Scientific Method',
            'Geography: Cartography & Climate Systems',
            'Sinhala / Tamil / English Literature Analysis',
          ],
        },
      ],
    },
  };

  const olCurriculum: StreamTopicData = {
    subjects: [
      {
        name: 'Mathematics (O/L)',
        topics: [
          'Fractions, Percentages & Commercial Arithmetic',
          'Algebra: Quadratics, Simultaneous Equations & Indices',
          'Geometry: Triangles, Angles & Circle Theorems',
          'Trigonometry: Angles of Elevation & Depression',
          'Mensuration: Area, Volume & Surface Calculations',
          'Probability & Statistics: Histograms & Pie Charts',
        ],
      },
      {
        name: 'Science (O/L)',
        topics: [
          'Biology: Photosynthesis, Respiration & Circulatory System',
          'Chemistry: Periodic Table, Atomic Structure & Acids/Bases',
          'Physics: Motion, Pressure, Electricity & Waves',
          'Ecosystems & Biodiversity in Sri Lanka',
        ],
      },
      {
        name: 'Core Subjects (O/L)',
        topics: [
          'Sinhala / Tamil Language & Literature Essays',
          'English Language: Comprehension, Grammar & Formal Letters',
          'Sri Lankan History: Anuradhapura to Modern Independence',
          'Religion: Philosophy, Principles & Moral Ethics',
        ],
      },
    ],
  };

  const currentCurriculum = examType === 'AL' ? alCurriculum[stream] : olCurriculum;

  // Local storage state for syllabus completion
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('vexta_syllabus_topics');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleTopic = (id: string) => {
    const updated = { ...checkedTopics, [id]: !checkedTopics[id] };
    setCheckedTopics(updated);
    localStorage.setItem('vexta_syllabus_topics', JSON.stringify(updated));
  };

  const resetSyllabus = () => {
    if (window.confirm('Reset your syllabus checklist progress for this view?')) {
      setCheckedTopics({});
      localStorage.removeItem('vexta_syllabus_topics');
    }
  };

  // Calculate total topic completion
  let totalTopics = 0;
  let completedTopics = 0;

  currentCurriculum.subjects.forEach((subj) => {
    subj.topics.forEach((topic) => {
      totalTopics++;
      const topicKey = `${subj.name}_${topic}`;
      if (checkedTopics[topicKey]) {
        completedTopics++;
      }
    });
  });

  const percentComplete = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  return (
    <section id="syllabus" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-[#0e1424] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1.5 uppercase tracking-wide">
              <BarChart3 className="w-4 h-4" />
              <span>High-Yield Revision Checklist</span>
              <span aria-hidden="true">·</span>
              <span>NIE Sri Lanka Syllabus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {examType === 'AL' ? 'A/L Stream Topic Matrix' : 'O/L Key Subject Matrix'}
            </h2>
          </div>

          {/* Progress badge and reset button */}
          <div className="flex items-center gap-4 self-start md:self-auto">
            <div className="text-right">
              <div className="text-xs text-slate-400">Revision Coverage</div>
              <div className="text-lg font-bold text-amber-400 font-mono">
                {completedTopics}/{totalTopics} ({percentComplete}%)
              </div>
            </div>
            <button
              onClick={resetSyllabus}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors border border-slate-800 rounded-lg bg-slate-900/60"
              title="Reset topic checklist"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global progress bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Subject columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCurriculum.subjects.map((subj) => (
            <div
              key={subj.name}
              className="bg-[#12192b] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div>
                <h3 className="text-base font-bold text-white mb-3 pb-2 border-b border-slate-800 flex items-center justify-between">
                  <span>{subj.name}</span>
                  <span className="text-xs font-mono text-slate-400 font-normal">
                    {subj.topics.filter((t) => checkedTopics[`${subj.name}_${t}`]).length}/{subj.topics.length}
                  </span>
                </h3>

                <div className="space-y-2 mt-2">
                  {subj.topics.map((topic) => {
                    const topicKey = `${subj.name}_${topic}`;
                    const isDone = Boolean(checkedTopics[topicKey]);
                    return (
                      <button
                        key={topic}
                        onClick={() => toggleTopic(topicKey)}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                          isDone
                            ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/20'
                            : 'bg-slate-900/50 text-slate-300 hover:bg-slate-900 border border-slate-800/60'
                        }`}
                      >
                        {isDone ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                        )}
                        <span className={isDone ? 'line-through opacity-70' : ''}>{topic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
