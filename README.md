# Bubble Lab 🌱 — Inquiry-Based Virtual Photosynthesis Lab

> **ET617 Educational Technology End-Semester Examination**  
> **Candidate Roll No. / Identity Token:** `23B2525`  
> **Live Deployed Application:** [https://et617-23b2525.vercel.app](https://et617-23b2525.vercel.app)  
> **GitHub Repository:** [https://github.com/PrimeDhruv/et617-endsem-23B2525](https://github.com/PrimeDhruv/et617-endsem-23B2525)

---

## 1. Exam Assignment Card

| Field | Assigned Exam Value & Description |
|---|---|
| **Identity Token** | **23B2525** |
| **Problem (P)** | **P5 – Inquiry-based virtual laboratory** (Simulation · Inquiry learning · Experimental reasoning). Learners manipulate variables, form hypotheses, run animated trials, interpret data, and learn from unexpected outcomes. |
| **Topic (T)** | **T3 – Factors affecting the rate of photosynthesis** (Class 10 topic simplified for Classes 3–5: light distance, water warmth, dissolved baking soda $CO_2$). |
| **Learner Context (L)** | **L7 – Multi-grade classroom**: one teacher, Classes 3–5 seated together, one projector for whole-class voting and a few shared touch tablets for small groups. |
| **Design Constraint (C)**| **C5 – Teacher-in-the-loop**: a real-time teacher dashboard showing learner trials, scores, and misconceptions, allowing the educator to approve, edit, or override all AI-generated feedback before it reaches learners. |

---

## 2. Quick Local Run Steps

### Prerequisites
- Node.js >= 18 (recommended v20+)
- npm >= 9

### Installation & Development Server
```bash
# 1. Install dependencies
npm install

# 2. Run local frontend (Vite)
npm run dev
# -> Opens http://localhost:5173

# 3. (Optional) Run with Vercel Serverless Function locally:
npx vercel dev
```

### Environment Variables
For AI feedback calls to Google Gemini:
```env
GEMINI_API_KEY="your-gemini-api-key"
```
*Note: If `GEMINI_API_KEY` is not provided or network is offline, the app seamlessly activates its built-in rule-based fallback engine (`src/lib/misconceptions.ts`), still routing all items through the teacher approval queue.*

---

## 3. Quick File Map for Viva Live Modifications

During viva defense, modify files directly at these paths:

| Viva Modification | File to Edit | Key Exports / Functions |
|---|---|---|
| **Change Photosynthesis Formula** | [`src/lib/model.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/lib/model.ts) | `bubblesPerMinute()`, `tempFactor`, `co2Factor` |
| **Change Questions, Feedback, Hints** | [`src/data/content.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/data/content.ts) | `TASK_1_MCQ` through `TASK_5_OPEN`, `DETECTIVE_HINTS` |
| **Change the AI System Prompt** | [`src/lib/prompts.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/lib/prompts.ts) | `SYSTEM_PROMPT` |
| **Change Teacher PIN or Presets** | [`src/data/content.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/data/content.ts) | `TEACHER_PIN = '1234'`, `TEACHER_OVERRIDE_PRESETS` |
| **Change Visual Palette & Colors** | [`tailwind.config.js`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/tailwind.config.js) & [`src/index.css`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/index.css) | `colors.plant`, `colors.sun`, `colors.water`, `colors.alert` |
| **Change Fair-Test Logic** | [`src/lib/fairTest.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/lib/fairTest.ts) | `evaluateFairTest()` |
| **Change Local Storage & Sync** | [`src/lib/storage.ts`](file:///Users/dhruvvaghasiya/Desktop/EtEndsem/src/lib/storage.ts) | `useAppState()`, `createDemoScenario()` |

---

## 4. Key Design Decisions (ADRs)

1. **Pure SVG without External Chart / Animation Libraries:** Hand-crafted SVG beaker, Hydrilla plant, movable lamp, thermometer, and bar charts maintain a lightweight bundle (&lt;300 KB gzip), instant load time, and complete explainability during viva inspection.
2. **Teacher-in-the-Loop Guardrail (Constraint C5):** Raw generative AI output is never displayed to elementary students unmoderated. All feedback defaults to `pending` in `/teacher` where the teacher can Approve (✅), Edit (✏️), or Override (🔁) using presets.
3. **Graceful Offline Fallback Engine:** If the Gemini serverless call times out (>6s) or has no API key, deterministic keyword heuristics identify Misconception M1 (*"hotter is always better"*) and M2 (*"plants make food in dark"*) and supply structured feedback.
4. **Non-Revealing Detective Hints Ladder (P5):** Unsuccessful trials do not flash red failure marks. Instead, a 4-step ladder (Reflect ➔ Compare ➔ Suggest Next Test ➔ Revise Guess) scaffolds learners to test 35°C without spoiling the outcome.
5. **Cross-Tab Real-Time Sync:** Combines storage event listeners with 2-second background polling, allowing a teacher dashboard tab and student tablets to stay synchronised on shared devices without a database.

---

## 5. Starter Templates & Libraries Used

- **Framework:** Vite 5 + React 18 + TypeScript 5
- **Routing:** `react-router-dom` v6
- **Styling:** Tailwind CSS 3.4
- **Runtime Types:** `@vercel/node`
- **Icons & Typography:** System Unicode emojis + Google Fonts Nunito
- **No Heavy Libraries:** Zero external chart libraries (no Chart.js/Recharts), zero animation libraries (no Framer Motion/GSAP).
