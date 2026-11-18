# DESIGN.md — Bubble Lab Design Specification & Instructional Rationale

**Course:** ET617 (Educational Technology)  
**Roll No. / Identity Token:** 23B2525  
**Topic (T3):** Factors affecting the rate of photosynthesis (simplified for Classes 3–5)  
**Problem (P5):** Inquiry-based virtual laboratory (Simulation · Inquiry learning · Experimental reasoning)  
**Learner Context (L7):** Multi-grade classroom: one teacher, Classes 3–5 together, one projector and a few shared devices  
**Design Constraint (C5):** Teacher-in-the-loop: a teacher view that shows learner progress and lets the teacher approve or override AI feedback  

---

## 1. Instructional Context & Learner Persona

### 1.1 Multi-Grade Learner Persona
- **Learners:** Children aged 8–10 (Grades 3, 4, and 5) studying together in a rural/semi-urban Indian classroom with one teacher.
- **Cognitive & Reading Profile:**
  - Class 3 (🌱 *Seedling*): Emerging readers. Understand observable actions (closer lamp = more light). Need visual anchors (emojis, icons), simple language (sentences ≤ 12 words), and direct counting.
  - Class 4 (🌿 *Sapling*): Developing experimental reasoning. Can grasp the "fair test" rule: change only ONE variable at a time to know what caused the change.
  - Class 5 (🌳 *Tree*): Developing analytical reasoning. Can interpret simple bar charts, compare trials, and articulate "because" explanations.
- **Physical Environment:**
  - **Class Mode (Projector):** The teacher drives the inquiry on a 1280×720 projector screen, facilitating whole-class discussion, hands-up voting, and collaborative prediction.
  - **Group Mode (Shared Tablets):** Small groups of 3–5 students share a single touch tablet (🐯 Tigers, 🦜 Parrots, 🐘 Elephants, 🐢 Turtles) rotating roles (Predictor, Lab Operator, Bubble Counter, Thinker).

### 1.2 Learning Outcomes (Bloom's Taxonomy)
1. **LO1 (Observe & Predict):** Learners can predict and observe that light and dissolved carbon dioxide ($CO_2$) increase the rate of oxygen bubble production in an aquatic plant (*Hydrilla*).
2. **LO2 (Fair Testing):** Learners can plan and execute a fair test by isolating a single independent variable (light, warmth, or baking soda) while holding other factors constant.
3. **LO3 (Analyze & Overcome Misconceptions):** Learners can interpret experimental evidence showing that optimal warmth (~25–35°C) yields peak bubbles, whereas extreme heat (45°C) stresses the plant and reduces bubbles, debunking the misconception that "hotter is always better."

---

## 2. Pedagogical Architecture & Inquiry Cycle

The app implements a structured 5-step inquiry cycle:

```
[Ask / Guess] ➔ [Test / Lab Bench] ➔ [Look / Think] ➔ [Revise / Hints] ➔ [Check / Mastery]
```

### 2.1 Core Misconceptions Addressed
- **Misconception M1 ("Hotter is always better"):** Children intuitively extrapolate that if warmth helps plants grow, higher heat (45°C) will create even more bubbles.
  - *Simulation reality:* Enzymes and cellular processes denature/stress at 45°C; bubbles drop dramatically from 17 (at 25°C) to 5 (at 45°C).
- **Misconception M2 ("Plants can make food in the dark / soil provides all food"):** Children often believe water plants don't strictly need light or that warmth alone produces food.
  - *Simulation reality:* Zero light = 0 bubbles, regardless of temperature or baking soda.

### 2.2 Detective Hints Ladder (P5 Non-revealing Scaffolding)
When an experiment produces an unexpected result or fails to support a learner's guess, the system **never reveals the correct answer**. Instead, it unlocks a 4-step reflective ladder:
1. **Step 1 (Reflect):** *"What did you think would happen? What actually happened to the bubbles?"*
2. **Step 2 (Compare):** Auto-highlights two contrasting trials side by side (e.g., Trial 2 at 25°C vs Trial 3 at 45°C): *"Look at Trial 2 and Trial 3. What is different? What happened to the bubbles?"*
3. **Step 3 (Suggest next test):** Proposes a test without giving away the outcome: *"Try 35°C, keeping everything else the same. Is there a 'best' warmth?"* with a 1-tap `[Try it in the lab]` button.
4. **Step 4 (Revise):** Encourages growth mindset: *"Scientists get surprised too. That's how they learn! 🔬 Do you want to change your guess?"* with a `[Change my guess]` button that links the new hypothesis to the previous one via `revisedFrom`.

---

## 3. Tasks, Questions & Rule-Based Feedback (§3 Verbatim Content)

The `/check` screen presents 5 formative assessment tasks spanning 4 interactive formats:

### Task 1: Multiple Choice (Predict Light Effect)
- **Question:** *"If we bring the lamp closer to the plant, the bubbles will…"*
- **Options:**
  - A) Increase ⬆ (Correct)
  - B) Decrease ⬇
  - C) Stay the same ➖
- **Feedback:**
  - *Correct:* *"🌟 Spot on! Closer lamp means stronger light, so the plant makes more food and oxygen bubbles!"*
  - *Incorrect (Decrease):* *"🤔 Look again! Remember when we moved the lamp closer in the lab? Strong light gives the plant more energy."*
  - *Incorrect (Stay same):* *"🤔 Check your lab trials! When the lamp was Near vs Far, did the bubble count stay identical?"*

### Task 2: True or False (M2: Light Requirement)
- **Question:** *"Plants can make food in the dark if they have warm water."*
- **Options:**
  - A) True
  - B) False (Correct)
- **Feedback:**
  - *Correct:* *"🎉 Excellent! Plants MUST have light energy to make food. In total darkness, bubbles were 0!"*
  - *M2 Misconception triggered (True):* *"🤔 Remember our Off trial? Even with warmth and baking soda, 0 light meant 0 bubbles. Plants cannot make food in the dark!"*

### Task 3: Tap the Bar (Data Interpretation)
- **Question:** *"Look at your lab bar chart below. Tap the trial bar that made the MOST bubbles!"*
- **Interaction:** SVG bar chart where bars are interactive touch targets.
- **Feedback:**
  - *Correct:* *"🏆 You found it! That trial had the best combination of light and warmth for photosynthesis!"*
  - *Incorrect:* *"🔍 Look for the tallest bar on the chart! Which trial number reaches the highest bubble count?"*

### Task 4: Pick the Fair Test (LO2: Fair Testing)
- **Question:** *"Two students want to test if baking soda ($CO_2$) helps the plant. Which test is FAIR?"*
- **Options:**
  - **Setup A:** Trial 1 has 1 spoon baking soda, 25°C, Near lamp. Trial 2 has 3 spoons baking soda, 25°C, Near lamp. (Changes ONLY baking soda) (Correct)
  - **Setup B:** Trial 1 has 1 spoon baking soda, 25°C, Far lamp. Trial 2 has 3 spoons baking soda, 45°C, Near lamp. (Changes baking soda, warmth, AND light)
- **Feedback:**
  - *Correct:* *"🎯 Brilliant scientist thinking! Setup A changes ONLY ONE thing. That is a fair test!"*
  - *Incorrect (Setup B):* *"🤔 In Setup B, three things changed at once! If the bubbles change, we won't know which one caused it!"*

### Task 5: Open-Ended Explanation (M1 & AI Review Loop)
- **Question:** *"Why did the bubbles drop when the water was heated to 45°C?"*
- **Input:** Text area (Class Mode: *"Teacher types the class answer"*).
- **Processing:** Sent to Gemini API via `/api/feedback`. Evaluated for Misconceptions M1 and M2.
- **Constraint C5 Gate:** Placed in Teacher Queue as `pending`. Learner sees `FeedbackCard` stating *"⏳ Your teacher is checking your answer…"*. Upon teacher approval, badge shows *"👩‍🏫 Checked by teacher"*.

---

## 4. Teacher-in-the-Loop Design (C5 Architecture)

### 4.1 Ethical & Pedagogical Guardrails
- **No Unvetted AI Output:** Under no circumstances is raw LLM text displayed directly to children without teacher verification.
- **Low Cognitive Load for Teacher:**
  - The teacher dashboard (`/teacher`) prioritizes the AI queue at the very top.
  - Every pending card displays: Team Name, Level, Child's Answer, AI Suggested Feedback, Detected Misconception Chip, and AI/Offline source tag.
  - One-tap quick actions: `[Approve ✅]`, `[Edit ✏️]`, or `[Override 🔁]`.

### 4.2 Teacher Override Presets (§5 Content)
When overriding or guiding discussion, the teacher can select from pre-calibrated pedagogical prompts:
1. *"Good thinking! Let's test it together on the projector."* (Encourages live group experiment)
2. *"Look at the 25°C and 45°C bars again — what do you notice?"* (Points back to data)
3. *"Let's talk about this as a class."* (Whole-group orchestration)
4. *"Notice what happens to leaves when it gets too hot. Are they happy?"* (Living organism empathy)
5. Custom free-text entry.

### 4.3 Fallback & Resilience Strategy
- If the Gemini API times out (> 6s), fails, or network is down:
  - System executes deterministic rule matching in `misconceptions.ts`.
  - M1 keywords (`hot`, `hotter`, `heat`, `warm`, `boiling`) trigger M1 fallback feedback: *"You noticed the heat! Look at your 25°C and 45°C trials again: did the bubbles go up or down?"*
  - M2 keywords (`dark`, `night`, `soil`, `shade`) trigger M2 fallback feedback.
  - Tagged visibly with `📴 Offline feedback`.
  - The item **still routes through the teacher queue** for approval. Zero disruption to classroom flow.

---

## 5. Visual Design System & Multi-Device Usability

- **Color Palette:**
  - Plant Green: `#2E7D32` (Primary, life, nature)
  - Sun Yellow: `#F9A825` (Accent, solar energy, active lamp)
  - Water Blue: `#1E88E5` (Aquatic environment, bubbles)
  - Alert Orange: `#EF6C00` (Unfair tests, temperature warnings)
  - Clean Background: `#FAFAF5` (Warm off-white for glare reduction on projectors)
  - Charcoal Text: `#1B1B1B` (High contrast WCAG AA compliance)
- **Typography:** Rounded accessible sans-serif, base size 20px (`text-xl`) for legibility across a classroom projector, headings 32–40px.
- **Touch Targets:** Minimum 56px height on all interactive elements.
- **Footnote:** Fixed footer `"ET617 · Roll No: 23B2525"` visible across all routes.
