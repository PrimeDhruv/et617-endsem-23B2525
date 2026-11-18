# 04. Implemented Features Matrix

| Feature | Description | File(s) | Status |
|---|---|---|---|
| **Welcome Screen** | Mode selection (Class Projector / Group Tablet), 4 team avatars, 3 grade levels | `src/pages/Welcome.tsx` | Done ✅ |
| **Ask & Guess** | Level-adaptive question, variable picker, hypothesis phrasing, class vote tallies | `src/pages/AskGuess.tsx` | Done ✅ |
| **Virtual Lab Bench** | Responsive SVG apparatus, movable lamp, thermometer, baking soda spoons | `src/pages/LabBench.tsx`, `LabScene.tsx` | Done ✅ |
| **10-Second Simulation Run** | Animated rising bubbles, live bubble counter ticking up, reduced-motion bypass | `BubbleCounter.tsx`, `src/lib/model.ts` | Done ✅ |
| **Fair Test Validator** | Detects 2+ altered variables, warns before running, tags trial ⚠️ Unfair | `src/lib/fairTest.ts`, `FairTestWarning.tsx` | Done ✅ |
| **Look & Think Results** | Observation table, SVG bar chart with striped unfair bars, guess vs result evaluation | `src/pages/LookThink.tsx`, `ResultsTable.tsx`, `BarChart.tsx` | Done ✅ |
| **Detective Hints Ladder** | 4-step scaffolding (Reflect ➔ Compare ➔ Suggest ➔ Revise) without revealing answer | `src/components/DetectiveHints.tsx` | Done ✅ |
| **Check Assessment** | 5 tasks across 4 formats (MCQ, True/False, Tap Bar, Fair Test, Open-Ended) | `src/pages/Check.tsx` | Done ✅ |
| **Gemini AI Feedback API** | Serverless route calling `gemini-2.5-flash` with strict 5-point validation | `api/feedback.ts`, `src/lib/prompts.ts` | Done ✅ |
| **Guaranteed Offline Fallback** | Deterministic M1/M2 keyword engine for zero-failure grading | `src/lib/misconceptions.ts`, `src/lib/feedbackClient.ts` | Done ✅ |
| **Teacher Dashboard (C5)** | PIN 1234, KPI stats, AI Queue (Approve/Edit/Override), Team progress table, Demo scenario | `src/pages/TeacherDashboard.tsx`, `TeacherQueueItem.tsx` | Done ✅ |
| **Exam About Screen** | Complete exam card, roll no 23B2525, 3 learning outcomes, persona details, credits | `src/pages/About.tsx`, `Footer.tsx` | Done ✅ |
