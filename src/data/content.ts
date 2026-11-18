import { Level, Variable } from '../types';

export const TEACHER_PIN = '1234';

export const TEAMS_LIST = [
  { name: 'Tigers', avatar: '🐯', color: 'from-amber-400 to-orange-500' },
  { name: 'Parrots', avatar: '🦜', color: 'from-emerald-400 to-green-600' },
  { name: 'Elephants', avatar: '🐘', color: 'from-blue-400 to-indigo-600' },
  { name: 'Turtles', avatar: '🐢', color: 'from-teal-400 to-emerald-600' },
];

export const LEVELS_INFO: Record<
  Level,
  {
    title: string;
    badge: string;
    classNumber: string;
    focus: string;
    description: string;
    question: string;
  }
> = {
  seedling: {
    title: 'Seedling',
    badge: '🌱',
    classNumber: 'Class 3',
    focus: 'Predict and count',
    description: 'Notice what happens to the bubbles when things change.',
    question: 'Does light change how many bubbles the plant makes?',
  },
  sapling: {
    title: 'Sapling',
    badge: '🌿',
    classNumber: 'Class 4',
    focus: 'Fair test',
    description: 'Change ONE thing at a time to keep tests fair.',
    question: 'Does light change how many bubbles the plant makes? Plan: which ONE thing will you change?',
  },
  tree: {
    title: 'Tree',
    badge: '🌳',
    classNumber: 'Class 5',
    focus: 'Read chart and explain',
    description: 'Compare trials on the bar chart and discover limiting factors.',
    question: 'Which factor (light, warmth or CO₂) changes the bubbles the most?',
  },
};

export const VARIABLES_CONFIG: Record<
  Variable,
  { name: string; icon: string; prompt: string; unit: string }
> = {
  light: {
    name: 'Light',
    icon: '☀️',
    prompt: 'How close the lamp is to the plant',
    unit: '%',
  },
  temp: {
    name: 'Warmth',
    icon: '🌡️',
    prompt: 'How warm or cold the water is',
    unit: '°C',
  },
  co2: {
    name: 'Baking Soda',
    icon: '🫧',
    prompt: 'Spoons of baking soda for food (CO₂)',
    unit: 'spoons',
  },
};

export const HYPOTHESIS_DIRECTIONS = [
  {
    key: 'more' as const,
    label: '⬆ More bubbles',
    phrase: 'make more bubbles',
    bg: 'bg-green-50 border-green-500 text-green-900',
  },
  {
    key: 'fewer' as const,
    label: '⬇ Fewer bubbles',
    phrase: 'make fewer bubbles',
    bg: 'bg-amber-50 border-amber-500 text-amber-900',
  },
  {
    key: 'same' as const,
    label: '➖ Same bubbles',
    phrase: 'make the same number of bubbles',
    bg: 'bg-blue-50 border-blue-500 text-blue-900',
  },
];

export const TEACHER_OVERRIDE_PRESETS = [
  'Good thinking! Let’s test it together on the projector. 📽️',
  'Look at the 25°C and 45°C bars again — what do you notice? 📊',
  'Let’s talk about this as a class. Hands up who noticed the drop! 🙋',
  'Notice what happens to leaves when it gets too hot. Are they happy? 🌿',
  'You made a great guess! What did your bubble count show?',
];

export const DETECTIVE_HINTS = {
  step1: {
    title: 'Clue 1: Reflect',
    prompt: 'What did you think would happen? What actually happened to the bubbles?',
  },
  step2: {
    title: 'Clue 2: Compare',
    prompt:
      'Look at Trial A and Trial B. What was the ONE thing that changed? Did bubbles go up or down?',
  },
  step3: {
    title: 'Clue 3: Next Experiment',
    prompt:
      'Try 35°C warmth, keeping everything else the same. Is there a "best" warmth for the plant?',
    suggestedSetup: { light: 60, temp: 35, co2: 2 },
  },
  step4: {
    title: 'Clue 4: Growth Mindset & Revise',
    prompt:
      'Scientists get surprised too. That is how real scientists learn! 🔬 Do you want to change your guess?',
  },
};

export const TASK_1_MCQ = {
  id: 'task-1',
  type: 'mcq' as const,
  title: 'Task 1: Predict Light Effect',
  question: 'If we bring the lamp closer to the plant, the bubbles will…',
  options: [
    { id: 'increase', text: 'Increase ⬆ (more bubbles)' },
    { id: 'decrease', text: 'Decrease ⬇ (fewer bubbles)' },
    { id: 'same', text: 'Stay the same ➖' },
  ],
  correctAnswer: 'increase',
  feedback: {
    correct: '🌟 Spot on! Closer lamp means stronger light, so the plant makes more food and oxygen bubbles!',
    decrease: '🤔 Look again! Remember when we moved the lamp closer in the lab? Strong light gives the plant more energy.',
    same: '🤔 Check your lab trials! When the lamp was Near vs Far, did the bubble count stay identical?',
  },
};

export const TASK_2_TF = {
  id: 'task-2',
  type: 'true_false' as const,
  title: 'Task 2: Light Requirement',
  question: 'Plants can make food in the dark if they have warm water.',
  options: [
    { id: 'true', text: 'True' },
    { id: 'false', text: 'False' },
  ],
  correctAnswer: 'false',
  feedback: {
    correct: '🎉 Excellent! Plants MUST have light energy to make food. In total darkness (Off), bubbles were 0!',
    incorrect: '🤔 Remember our Off trial? Even with warmth and baking soda, 0 light meant 0 bubbles. Plants cannot make food in the dark! (Misconception M2)',
  },
};

export const TASK_3_BAR = {
  id: 'task-3',
  type: 'tap_bar' as const,
  title: 'Task 3: Reading Your Results',
  question: 'Look at the bar chart below. Tap the trial bar that made the MOST bubbles!',
  feedback: {
    correct: '🏆 You found it! That trial had the best combination of light and warmth for photosynthesis!',
    incorrect: '🔍 Look for the tallest bar on the chart! Which trial reached the highest bubble count?',
  },
};

export const TASK_4_FAIR = {
  id: 'task-4',
  type: 'fair_test' as const,
  title: 'Task 4: Spot the Fair Test',
  question: 'Two students want to test if baking soda (CO₂) helps the plant. Which test is FAIR?',
  options: [
    {
      id: 'A',
      title: 'Setup A (Changes 1 thing)',
      desc: 'Trial 1: 1 spoon, 25°C, Near lamp.\nTrial 2: 3 spoons, 25°C, Near lamp.',
      fair: true,
    },
    {
      id: 'B',
      title: 'Setup B (Changes 3 things)',
      desc: 'Trial 1: 1 spoon, 25°C, Far lamp.\nTrial 2: 3 spoons, 45°C, Near lamp.',
      fair: false,
    },
  ],
  correctAnswer: 'A',
  feedback: {
    correct: '🎯 Brilliant scientist thinking! Setup A changes ONLY ONE thing (baking soda). That is a fair test!',
    incorrect: '🤔 In Setup B, three things changed at once! If the bubbles change, we cannot know which one caused it.',
  },
};

export const TASK_5_OPEN = {
  id: 'task-5',
  type: 'open_ended' as const,
  title: 'Task 5: Scientific Explanation',
  question: 'Why did the bubbles drop when the water was heated to 45°C?',
  placeholder: 'Explain what happened to the plant in hot water (because…)',
  classPlaceholder: 'Teacher types the class answer discussed together…',
};

export const CHECK_TASKS = [
  TASK_1_MCQ,
  TASK_2_TF,
  TASK_3_BAR,
  TASK_4_FAIR,
  TASK_5_OPEN,
];

export const WHAT_YOU_DISCOVERED = [
  '☀️ Light & Baking Soda: Plants need light energy and dissolved carbon dioxide to create food and release oxygen bubbles.',
  '⚖️ Fair Testing: A scientific test is only fair when you change ONE factor at a time while keeping everything else identical.',
  '🌡️ Best Temperature: Mild warmth (~25°C to 35°C) is ideal, but excessive heat (45°C) stresses the living plant and halts bubble production.',
];
