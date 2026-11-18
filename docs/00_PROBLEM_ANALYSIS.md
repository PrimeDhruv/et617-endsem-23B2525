# 00. Problem Analysis — Bubble Lab 🌱

**Exam Assignment:** ET617 · Roll No: 23B2525  
**Topic:** Factors affecting photosynthesis rate (Cl. 10 simplified for Cl. 3–5)  
**Problem Requirement (P5):** Virtual laboratory for variable manipulation, hypothesis formulation, experimental reasoning, and revising hypotheses from unexpected outcomes.

---

## 1. Problem Statement & Restatement
- **Verbatim:** Build an inquiry-based virtual photosynthesis laboratory for Classes 3–5 in a multi-grade classroom with teacher-in-the-loop review.
- **3-Line Restatement:**
  1. Primary students predict and test how light, warmth, and $CO_2$ affect oxygen bubbles from water plant *Hydrilla*.
  2. The lab supports fair-testing, detects common misconceptions (e.g., heat stress at 45°C), and scaffolds reflection without revealing answers.
  3. A teacher dashboard enforces Constraint C5 by vetting all AI formative feedback before students see it.

## 2. Target Users & Needs
- **Class 3 (🌱 Seedling):** Concrete thinkers, emerging readers. Need visual anchors, simple language, and direct bubble counting.
- **Class 4 (🌿 Sapling):** Developing experimentalists. Need to grasp fair testing (change only ONE variable at a time).
- **Class 5 (🌳 Tree):** Analytical thinkers. Need bar chart comparison and causal reasoning.
- **Teacher (Multi-grade Classroom):** Manages all three grades simultaneously with 1 projector and a few shared tablets. Needs quick oversight and control over AI feedback.

## 3. Measurable Learning Objectives (Bloom's Taxonomy)
- **LO1 (Understand & Predict):** Predict and observe bubble rate changes from light intensity and dissolved $CO_2$.
- **LO2 (Apply Fair Testing):** Execute fair tests by altering a single variable while holding others constant.
- **LO3 (Analyze & Overcome Misconceptions):** Interpret non-linear temperature effects (peak ~25–35°C vs heat stress at 45°C) to debunk the "hotter is always better" misconception (M1).

## 4. MoSCoW Feature Scope
- **Must Have:** 7 connected routes, interactive SVG beaker/plant/lamp/thermometer, fair test validator, 10s animated bubble counter, 4-step detective hints ladder, 5 check tasks, teacher PIN gate, AI queue with approve/edit/override, offline fallback.
- **Should Have:** Demo scenario loader for viva testing, class voting tallies, cross-tab sync.
- **Could Have:** Sound effects for bubbles (omitted to avoid classroom noise).
- **Won't Have:** User login/database (uses zero-dependency `localStorage`).
