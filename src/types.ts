export type Level = 'seedling' | 'sapling' | 'tree'; // Class 3 / 4 / 5
export type Mode = 'class' | 'group'; // projector vs shared device
export type LightLevel = 0 | 30 | 60 | 100; // off / far / middle / near
export type Temp = 10 | 25 | 35 | 45;
export type Spoons = 0 | 1 | 2 | 3;
export type Variable = 'light' | 'temp' | 'co2';

export interface Setup {
  light: LightLevel;
  temp: Temp;
  co2: Spoons;
}

export interface Trial {
  id: string;
  n: number;
  setup: Setup;
  bubbles: number;
  changed: Variable[];
  fair: boolean;
  timestamp: number;
}

export interface Hypothesis {
  id: string;
  variable: Variable;
  direction: 'more' | 'fewer' | 'same';
  because?: string;
  createdAt: number;
  revisedFrom?: string; // id of previous hypothesis
}

export type FeedbackStatus = 'pending' | 'approved' | 'edited' | 'overridden';

export interface FeedbackItem {
  id: string;
  teamId: string;
  taskId: string;
  question: string;
  answer: string;
  aiFeedback: string;
  misconception: 'M1' | 'M2' | 'none';
  nextHint: string;
  source: 'ai' | 'offline';
  status: FeedbackStatus;
  finalText?: string;
  createdAt: number;
  decidedAt?: number;
}

export interface ClassVote {
  studentName: string;
  teamName: string;
  vote: 'more' | 'fewer' | 'same';
  variable: Variable;
  timestamp: number;
}

export interface Team {
  id: string;
  name: string;
  avatar: string;
  level: Level;
  mode: Mode;
  students?: string[]; // student members in this team
  votes?: Record<string, 'more' | 'fewer' | 'same'>; // studentName -> vote choice
  trials: Trial[];
  hypotheses: Hypothesis[];
  hintsUsed: number;
  taskAnswers: Record<string, { answer: string; correct: boolean | null; misconception?: 'M1' | 'M2' }>;
  misconceptionsSeen: ('M1' | 'M2')[];
}

export interface AppState {
  teams: Team[];
  activeTeamId: string | null;
  feedbackQueue: FeedbackItem[];
  classVotes?: ClassVote[];
}
