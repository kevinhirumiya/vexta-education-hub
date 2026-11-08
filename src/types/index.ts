export type ExamType = 'AL' | 'OL';

export type ALStream = 'physical_science' | 'biological_science' | 'commerce' | 'arts' | 'technology';

export interface ExamPreset {
  id: string;
  type: ExamType;
  title: string;
  subtitle: string;
  targetDate: string; // ISO string or YYYY-MM-DDTHH:mm:ss
  defaultStream?: ALStream;
  description: string;
}

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  totalDays: number;
  totalHours: number;
  totalWeeks: number;
  isPast: boolean;
}

export interface PastPaperRecord {
  year: number;
  paper1: boolean;
  paper2: boolean;
  score?: number;
}

export interface HabitItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
}

export interface SubjectItem {
  id: string;
  name: string;
  topics: {
    id: string;
    name: string;
    completed: boolean;
  }[];
}
