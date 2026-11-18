# 03. Design Decisions (ADRs)

### D-01: Static Client-Side SPA with Vercel Serverless Function
- **Context:** Timed university exam requiring high reliability, no cold-start timeouts for frontend, and secure Gemini API calling.
- **Decision:** Vite + React + TypeScript deployed on Vercel with single API route `/api/feedback.ts`.
- **Trade-offs:** Slightly more complex deployment than pure static site, but satisfies no-secrets rule.

### D-02: Pure Hand-Written SVG instead of External Chart/Canvas Libraries
- **Context:** Need lightweight bundle, responsive layout for 360px to 1280px projector, and easy viva code explainability.
- **Decision:** All graphics (beaker, plant, thermometer, lamp, bar chart) written in vanilla SVG.
- **Trade-offs:** More lines of SVG code written by hand, but zero heavy dependencies and total CSS/DOM control.

### D-03: Teacher-in-the-Loop Constraint C5 Architecture
- **Context:** Young elementary learners (Classes 3–5) should not receive hallucinations or unvetted AI responses.
- **Decision:** All AI and offline feedback enters the queue as `pending`. Nothing reaches the learner until the teacher clicks Approve, Edit, or Override.
- **Trade-offs:** Requires teacher intervention, but adheres strictly to ethical educational guidelines.

### D-04: Deterministic Rule-Based Fallback for Offline Resilience
- **Context:** Exam environments may suffer network throttling, timeouts, or lack of API keys.
- **Decision:** Keyword heuristic engine (`src/lib/misconceptions.ts`) detects M1 and M2 and generates structured feedback tagged as `📴 Offline feedback`.
- **Trade-offs:** Keywords are less nuanced than LLM embeddings, but 100% reliable and fail-safe.

### D-05: Non-Revealing 4-Step Detective Hint Ladder (P5)
- **Context:** Problem P5 requires supporting learning from unsuccessful trials without revealing the answer.
- **Decision:** Ladder unlocks Reflect ➔ Compare ➔ Suggest 35°C ➔ Revise Guess without ever stating "45°C is too hot".
- **Trade-offs:** Requires student to run an additional trial, which reinforces authentic scientific inquiry.

### D-06: Dual-Orchestration Mode (Class Projector vs Group Tablet)
- **Context:** Multi-grade classroom with 1 projector and few shared tablets (L7).
- **Decision:** Class Mode features hands-up vote tallies; Group Mode offers team avatar selection (Tigers, Parrots, Elephants, Turtles).

### D-07: Error-Free Tone & Psychological Safety
- **Context:** Primary children get intimidated by harsh red ✗ marks.
- **Decision:** No red error crosses; use encouraging language: *"🤔 Surprise! The plant did something different"* and *"Scientists get surprised too!"*

### D-08: Cross-Tab Polling Synchronization
- **Context:** Teacher and student views often run in separate browser tabs on the same computer or device.
- **Decision:** `useAppState` hook listens to storage events and polls `localStorage` every 2000ms.
