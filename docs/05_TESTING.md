# 05. Testing & Verification Checklist

## 1. Acceptance Checklist (All Verified ✅)
- [x] **7 Routes Functional:** `/`, `/ask`, `/lab`, `/look`, `/check`, `/teacher`, `/about`, plus SPA rewrite in `vercel.json`.
- [x] **Roll No Footer:** `"ET617 · Roll No: 23B2525"` visible on every screen.
- [x] **About Screen:** Exam Card with token `23B2525`, P5, T3, L7, C5, 3 learning outcomes.
- [x] **Correct Path:** Tigers (Sapling), hypothesis Light ➔ More, trials light 30 ➔ 100 with others constant ➔ Guess Supported ➔ Check.
- [x] **Misconception Path:** Parrots, Warmth ➔ More, 25°C (17 bubbles) then 45°C (5 bubbles) ➔ bubbles drop ➔ Detective Hints ladder ➔ Suggest 35°C ➔ Revise.
- [x] **Fair-Test Validator:** Altering 2 variables triggers warning dialog; running anyway tags trial ⚠️ Unfair.
- [x] **Task 5 C5 Loop:** Learner submits answer ➔ sees `"⏳ Your teacher is checking your answer…"`; Teacher approves/edits/overrides in `/teacher` ➔ student card updates within 2 seconds.
- [x] **Offline Fallback:** If network is down or API key is absent, fallback engine tags `📴 Offline feedback` and still requires teacher review.
- [x] **Responsive Layout:** Tested at 360px (mobile) and 1280×720 (classroom projector).
- [x] **Build & Types:** `npm run build` passes with zero TypeScript errors.
