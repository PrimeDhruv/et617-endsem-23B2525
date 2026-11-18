# 09. Code Walkthrough for Viva Defense

### 1. `src/lib/model.ts`
- **Purpose:** Pure simulation math calculating oxygen bubbles per minute.
- **Key Function:** `bubblesPerMinute(s: Setup): number`. If `s.light === 0`, returns 0. Otherwise, computes limiting factor `Math.min(s.light / 100, co2Factor[s.co2])` and multiplies by `tempFactor[s.temp]`.

### 2. `src/lib/fairTest.ts`
- **Purpose:** Enforces scientific fair-testing logic.
- **Key Function:** `evaluateFairTest(current, previous)`. Compares current light, temp, and co2 against the previous trial. If changed variables length <= 1, `fair: true`. If 2 or 3 changed, `fair: false`.

### 3. `src/lib/storage.ts`
- **Purpose:** State persistence and reactive synchronization.
- **Key Hook:** `useAppState()`. Subscribes to `storage` events and runs a 2-second polling interval against `bubblelab.v1` in `localStorage`. Exposes `addTrial`, `addHypothesis`, `addFeedbackItem`, `updateFeedbackStatus`, and `loadDemo`.

### 4. `src/lib/prompts.ts` & `api/feedback.ts`
- **Purpose:** System prompt definition and Vercel serverless AI endpoint calling Gemini 2.5 Flash.
- **Validation:** Enforces JSON schema, <=40 words, valid misconception enum, and checks against give-away phrases.

### 5. `src/pages/TeacherDashboard.tsx`
- **Purpose:** Teacher-in-the-loop (C5) orchestration interface.
- **Sections:** KPI stats banner, Section A AI Feedback Queue with Approve/Edit/Override, Section B Team Progress table, Section C Class controls and Demo scenario loader.
