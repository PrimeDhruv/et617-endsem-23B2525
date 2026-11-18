import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AppState,
  Team,
  Trial,
  Hypothesis,
  FeedbackItem,
  FeedbackStatus,
  Level,
  Mode,
  Variable,
} from '../types';
import { TEAMS_LIST, ALL_CLASS_STUDENTS } from '../data/content';

export const STORAGE_KEY = 'bubblelab.v1';

/**
 * Initial empty / baseline application state with student rosters
 */
export const INITIAL_STATE: AppState = {
  teams: [
    {
      id: 'team-class-default',
      name: 'Whole Class 🏫',
      avatar: '🏫',
      level: 'sapling',
      mode: 'class',
      students: ALL_CLASS_STUDENTS.map((s) => s.name),
      votes: {
        'Aarav Patel': 'more',
        'Diya Sharma': 'more',
        'Ananya Sen': 'more',
        'Vihaan Rao': 'more',
        'Kabir Mehta': 'more',
        'Priya Reddy': 'more',
        'Rohan Verma': 'same',
        'Tanya Gupta': 'same',
        'Meera Nair': 'fewer',
        'Riya Das': 'fewer',
      },
      trials: [],
      hypotheses: [],
      hintsUsed: 0,
      taskAnswers: {},
      misconceptionsSeen: [],
    },
  ],
  activeTeamId: 'team-class-default',
  feedbackQueue: [],
  classVotes: ALL_CLASS_STUDENTS.map((s) => ({
    studentName: s.name,
    teamName: s.team,
    vote: s.defaultVote,
    variable: 'light',
    timestamp: Date.now() - 3600000,
  })),
};

/**
 * Safely loads state from localStorage with fallback to default state.
 */
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.teams)) {
      return parsed as AppState;
    }
    return INITIAL_STATE;
  } catch (err) {
    console.warn('Corrupted or inaccessible localStorage for bubblelab.v1. Resetting to defaults.', err);
    return INITIAL_STATE;
  }
}

/**
 * Safely saves state to localStorage.
 */
export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to write to localStorage for bubblelab.v1:', err);
  }
}

/**
 * Reset all application state back to clean initial defaults.
 */
export function resetStorage(): AppState {
  saveState(INITIAL_STATE);
  return INITIAL_STATE;
}

/**
 * Generates the pre-configured Parrots demo scenario (M1 misconception)
 * Team 🦜 Parrots (Sapling) with hypothesis temp→more and trials at 25°→17 and 45°→5,
 * plus one pending feedback item in the queue.
 */
export function createDemoScenario(): AppState {
  const parrotTeamId = 'team-parrots-demo';
  const tigersTeamId = 'team-tigers-demo';
  const elephantsTeamId = 'team-elephants-demo';
  const turtlesTeamId = 'team-turtles-demo';

  // Parrots Hypothesis & Trials (Misconception M1 demonstration)
  const parrotHypothesis: Hypothesis = {
    id: 'hyp-parrots-1',
    variable: 'temp',
    direction: 'more',
    because: 'because plants like summer and more heat makes more bubbles',
    createdAt: Date.now() - 1000 * 60 * 15,
  };

  const parrotTrial1: Trial = {
    id: 'trial-parrots-1',
    n: 1,
    setup: { light: 100, temp: 25, co2: 2 },
    bubbles: 17,
    changed: [],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 10,
  };

  const parrotTrial2: Trial = {
    id: 'trial-parrots-2',
    n: 2,
    setup: { light: 100, temp: 45, co2: 2 },
    bubbles: 5,
    changed: ['temp'],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 5,
  };

  // Tigers Trials (Fair Testing & High Performance demonstration)
  const tigerTrial1: Trial = {
    id: 'trial-tigers-1',
    n: 1,
    setup: { light: 30, temp: 25, co2: 2 },
    bubbles: 6,
    changed: [],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 20,
  };
  const tigerTrial2: Trial = {
    id: 'trial-tigers-2',
    n: 2,
    setup: { light: 60, temp: 25, co2: 2 },
    bubbles: 12,
    changed: ['light'],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 16,
  };
  const tigerTrial3: Trial = {
    id: 'trial-tigers-3',
    n: 3,
    setup: { light: 100, temp: 25, co2: 2 },
    bubbles: 17,
    changed: ['light'],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 12,
  };

  // Elephants Trials (CO2 Limiting Factor)
  const elephantTrial1: Trial = {
    id: 'trial-elephants-1',
    n: 1,
    setup: { light: 60, temp: 25, co2: 0 },
    bubbles: 6,
    changed: [],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 18,
  };
  const elephantTrial2: Trial = {
    id: 'trial-elephants-2',
    n: 2,
    setup: { light: 60, temp: 25, co2: 3 },
    bubbles: 12,
    changed: ['co2'],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 14,
  };

  // Turtles Trials (Class 3 Seedling)
  const turtleTrial1: Trial = {
    id: 'trial-turtles-1',
    n: 1,
    setup: { light: 0, temp: 25, co2: 2 },
    bubbles: 0,
    changed: [],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 22,
  };
  const turtleTrial2: Trial = {
    id: 'trial-turtles-2',
    n: 2,
    setup: { light: 60, temp: 25, co2: 2 },
    bubbles: 12,
    changed: ['light'],
    fair: true,
    timestamp: Date.now() - 1000 * 60 * 19,
  };

  const pendingItem: FeedbackItem = {
    id: 'feedback-parrots-task5',
    teamId: parrotTeamId,
    taskId: 'task-5',
    question: 'Why did the bubbles drop when the water was heated to 45°C?',
    answer: 'Because the water got too hot for the plant and made it tired.',
    aiFeedback: 'Great observation! You saw the bubbles drop at 45°C. What was the bubble count at 25°C compared to 45°C?',
    misconception: 'M1',
    nextHint: 'Try testing at 35°C to see if warm is better than very hot.',
    source: 'ai',
    status: 'pending',
    createdAt: Date.now() - 1000 * 60 * 2,
  };

  const demoParrots: Team = {
    id: parrotTeamId,
    name: 'Parrots',
    avatar: '🦜',
    level: 'sapling',
    mode: 'group',
    students: ['Ananya Sen', 'Vihaan Rao', 'Meera Nair'],
    votes: { 'Ananya Sen': 'more', 'Vihaan Rao': 'more', 'Meera Nair': 'fewer' },
    trials: [parrotTrial1, parrotTrial2],
    hypotheses: [parrotHypothesis],
    hintsUsed: 2,
    taskAnswers: {
      'task-1': { answer: 'increase', correct: true },
      'task-2': { answer: 'false', correct: true },
      'task-3': { answer: 'sample-2', correct: true },
      'task-4': { answer: 'A', correct: true },
      'task-5': {
        answer: 'Because the water got too hot for the plant and made it tired.',
        correct: null,
        misconception: 'M1',
      },
    },
    misconceptionsSeen: ['M1'],
  };

  const demoTigers: Team = {
    id: tigersTeamId,
    name: 'Tigers',
    avatar: '🐯',
    level: 'sapling',
    mode: 'group',
    students: ['Aarav Patel', 'Diya Sharma', 'Rohan Verma'],
    votes: { 'Aarav Patel': 'more', 'Diya Sharma': 'more', 'Rohan Verma': 'same' },
    trials: [tigerTrial1, tigerTrial2, tigerTrial3],
    hypotheses: [
      {
        id: 'hyp-tigers-1',
        variable: 'light',
        direction: 'more',
        because: 'because plants absorb light energy to make sugar',
        createdAt: Date.now() - 1000 * 60 * 25,
      },
    ],
    hintsUsed: 0,
    taskAnswers: {
      'task-1': { answer: 'increase', correct: true },
      'task-2': { answer: 'false', correct: true },
      'task-3': { answer: 'trial-tigers-3', correct: true },
      'task-4': { answer: 'A', correct: true },
      'task-5': {
        answer: 'Heat of 45°C damaged the leaves and enzyme machinery.',
        correct: true,
      },
    },
    misconceptionsSeen: [],
  };

  const demoElephants: Team = {
    id: elephantsTeamId,
    name: 'Elephants',
    avatar: '🐘',
    level: 'tree',
    mode: 'group',
    students: ['Kabir Mehta', 'Ishaan Joshi', 'Tanya Gupta'],
    votes: { 'Kabir Mehta': 'more', 'Ishaan Joshi': 'more', 'Tanya Gupta': 'same' },
    trials: [elephantTrial1, elephantTrial2],
    hypotheses: [
      {
        id: 'hyp-elephants-1',
        variable: 'co2',
        direction: 'more',
        because: 'baking soda provides dissolved carbon dioxide',
        createdAt: Date.now() - 1000 * 60 * 20,
      },
    ],
    hintsUsed: 1,
    taskAnswers: {
      'task-1': { answer: 'increase', correct: true },
      'task-2': { answer: 'false', correct: true },
      'task-3': { answer: 'trial-elephants-2', correct: true },
      'task-4': { answer: 'A', correct: true },
    },
    misconceptionsSeen: [],
  };

  const demoTurtles: Team = {
    id: turtlesTeamId,
    name: 'Turtles',
    avatar: '🐢',
    level: 'seedling',
    mode: 'group',
    students: ['Priya Reddy', 'Dev Choudhury', 'Riya Das'],
    votes: { 'Priya Reddy': 'more', 'Dev Choudhury': 'more', 'Riya Das': 'fewer' },
    trials: [turtleTrial1, turtleTrial2],
    hypotheses: [
      {
        id: 'hyp-turtles-1',
        variable: 'light',
        direction: 'more',
        createdAt: Date.now() - 1000 * 60 * 24,
      },
    ],
    hintsUsed: 1,
    taskAnswers: {
      'task-1': { answer: 'increase', correct: true },
      'task-2': { answer: 'false', correct: true },
      'task-3': { answer: 'trial-turtles-2', correct: true },
      'task-4': { answer: 'A', correct: true },
    },
    misconceptionsSeen: [],
  };

  const demoState: AppState = {
    teams: [demoParrots, demoTigers, demoElephants, demoTurtles],
    activeTeamId: parrotTeamId,
    feedbackQueue: [pendingItem],
    classVotes: ALL_CLASS_STUDENTS.map((s) => ({
      studentName: s.name,
      teamName: s.team,
      vote: s.defaultVote,
      variable: s.team === 'Parrots' ? 'temp' : s.team === 'Elephants' ? 'co2' : 'light',
      timestamp: Date.now() - 1000 * 60 * 20,
    })),
  };

  saveState(demoState);
  return demoState;
}

/**
 * Custom React hook that binds to localStorage with:
 * 1. Immediate in-tab state reactivity
 * 2. Cross-tab storage event listeners
 * 3. 2-second interval polling for real-time teacher-learner synchronization
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(() => loadState());

  // Helper to update state in memory and persist to localStorage
  const updateState = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      saveState(next);
      return next;
    });
  }, []);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const fresh = JSON.parse(e.newValue);
          setState(fresh);
        } catch (err) {
          console.warn('Failed parsing incoming storage event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 2-second polling to guarantee synchronization between tabs
  useEffect(() => {
    const interval = setInterval(() => {
      const fresh = loadState();
      setState((prev) => {
        // Compare serialization to avoid unnecessary re-renders
        if (JSON.stringify(prev) !== JSON.stringify(fresh)) {
          return fresh;
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Currently active team object
  const activeTeam = useMemo(() => {
    return state.teams.find((t) => t.id === state.activeTeamId) || state.teams[0] || null;
  }, [state.teams, state.activeTeamId]);

  // Set active team by ID
  const setActiveTeamId = useCallback(
    (id: string) => {
      updateState((prev) => ({ ...prev, activeTeamId: id }));
    },
    [updateState]
  );

  // Switch or create a team
  const createOrSelectTeam = useCallback(
    (name: string, avatar: string, level: Level, mode: Mode): string => {
      const existing = state.teams.find(
        (t) => t.name.toLowerCase() === name.toLowerCase() && t.mode === mode
      );

      if (existing) {
        updateState((prev) => ({
          ...prev,
          activeTeamId: existing.id,
          teams: prev.teams.map((t) => (t.id === existing.id ? { ...t, level } : t)),
        }));
        return existing.id;
      }

      const matchingRoster = TEAMS_LIST.find(
        (t) => t.name.toLowerCase() === name.toLowerCase()
      );
      const students = matchingRoster
        ? matchingRoster.members.map((m) => m.name)
        : name.includes('Class')
        ? ALL_CLASS_STUDENTS.map((s) => s.name)
        : undefined;

      const newId = `team-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
      const newTeam: Team = {
        id: newId,
        name,
        avatar,
        level,
        mode,
        students,
        trials: [],
        hypotheses: [],
        hintsUsed: 0,
        taskAnswers: {},
        misconceptionsSeen: [],
      };

      updateState((prev) => ({
        ...prev,
        teams: [...prev.teams, newTeam],
        activeTeamId: newId,
      }));

      return newId;
    },
    [state.teams, updateState]
  );

  // Add a trial to a team
  const addTrial = useCallback(
    (teamId: string, trial: Trial) => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          return {
            ...t,
            trials: [...t.trials, trial],
          };
        }),
      }));
    },
    [updateState]
  );

  // Add or update hypothesis
  const addHypothesis = useCallback(
    (teamId: string, hypothesis: Hypothesis) => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          return {
            ...t,
            hypotheses: [...t.hypotheses, hypothesis],
          };
        }),
      }));
    },
    [updateState]
  );

  // Record an answer to a task
  const recordTaskAnswer = useCallback(
    (
      teamId: string,
      taskId: string,
      answer: string,
      correct: boolean | null,
      misconception?: 'M1' | 'M2'
    ) => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          const updatedAnswers = {
            ...t.taskAnswers,
            [taskId]: { answer, correct, misconception },
          };
          const updatedMisconceptions = [...t.misconceptionsSeen];
          if (misconception && !updatedMisconceptions.includes(misconception)) {
            updatedMisconceptions.push(misconception);
          }
          return {
            ...t,
            taskAnswers: updatedAnswers,
            misconceptionsSeen: updatedMisconceptions,
          };
        }),
      }));
    },
    [updateState]
  );

  // Increment hints used
  const incrementHintsUsed = useCallback(
    (teamId: string) => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => (t.id === teamId ? { ...t, hintsUsed: t.hintsUsed + 1 } : t)),
      }));
    },
    [updateState]
  );

  // Record that a misconception was observed in trials
  const recordMisconceptionSeen = useCallback(
    (teamId: string, misconception: 'M1' | 'M2') => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => {
          if (t.id !== teamId) return t;
          if (t.misconceptionsSeen.includes(misconception)) return t;
          return {
            ...t,
            misconceptionsSeen: [...t.misconceptionsSeen, misconception],
          };
        }),
      }));
    },
    [updateState]
  );

  // Add feedback item to teacher queue
  const addFeedbackItem = useCallback(
    (item: FeedbackItem) => {
      updateState((prev) => ({
        ...prev,
        feedbackQueue: [item, ...prev.feedbackQueue.filter((q) => q.id !== item.id)],
      }));
    },
    [updateState]
  );

  // Update feedback item status (teacher approve / edit / override)
  const updateFeedbackStatus = useCallback(
    (id: string, status: FeedbackStatus, finalText?: string) => {
      updateState((prev) => ({
        ...prev,
        feedbackQueue: prev.feedbackQueue.map((item) => {
          if (item.id !== id) return item;
          return {
            ...item,
            status,
            finalText: finalText !== undefined ? finalText : item.finalText || item.aiFeedback,
            decidedAt: Date.now(),
          };
        }),
      }));
    },
    [updateState]
  );

  // Record an individual student vote
  const recordClassVote = useCallback(
    (studentName: string, teamName: string, vote: 'more' | 'fewer' | 'same', variable: Variable) => {
      updateState((prev) => {
        const existing = prev.classVotes || [];
        const filtered = existing.filter((v) => v.studentName !== studentName);
        return {
          ...prev,
          classVotes: [
            ...filtered,
            { studentName, teamName, vote, variable, timestamp: Date.now() },
          ],
        };
      });
    },
    [updateState]
  );

  // Switch class mode level
  const setClassLevel = useCallback(
    (level: Level) => {
      updateState((prev) => ({
        ...prev,
        teams: prev.teams.map((t) => (t.mode === 'class' ? { ...t, level } : t)),
      }));
    },
    [updateState]
  );

  // Load demo scenario
  const loadDemo = useCallback(() => {
    const demo = createDemoScenario();
    setState(demo);
  }, []);

  // Reset all data
  const resetAll = useCallback(() => {
    const fresh = resetStorage();
    setState(fresh);
  }, []);

  return {
    state,
    activeTeam,
    setActiveTeamId,
    createOrSelectTeam,
    addTrial,
    addHypothesis,
    recordTaskAnswer,
    incrementHintsUsed,
    recordMisconceptionSeen,
    addFeedbackItem,
    updateFeedbackStatus,
    recordClassVote,
    setClassLevel,
    loadDemo,
    resetAll,
  };
}
