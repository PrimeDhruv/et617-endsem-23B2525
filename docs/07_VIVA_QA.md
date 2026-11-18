# 07. Comprehensive Viva Voce Q&A (25+ Questions)

### Category A: Domain & Instructional Design (ET617)
1. **Q: Why simplify Class 10 photosynthesis for Classes 3–5?**  
   *A:* At primary age, biochemical equations are abstract, but counting oxygen bubbles from an aquatic plant provides concrete, sensory evidence of plant vitality.
2. **Q: How does the app address multi-grade classroom L7?**  
   *A:* Three graded levels (🌱 Seedling for Cl. 3, 🌿 Sapling for Cl. 4, 🌳 Tree for Cl. 5) with differentiated vocabulary and tasks, plus Class Mode for whole-group projector discussion.
3. **Q: What learning theories ground your app?**  
   *A:* Bybee’s 5E inquiry cycle, Vygotsky’s Scaffolding/ZPD (Detective Hints ladder), Conceptual Change Theory (Posner) for confronting Misconception M1.
4. **Q: Why never reveal the correct answer in Detective Hints (P5)?**  
   *A:* Telling students the answer short-circuits inquiry. Prompting a comparison between 25°C and 45°C and suggesting a test at 35°C enables learners to construct understanding themselves.

### Category B: AI Design & Constraint C5
5. **Q: Why is Constraint C5 (Teacher-in-the-loop) essential for primary learners?**  
   *A:* Direct LLM generation risks hallucinations, inappropriate reading levels, or giving away answers. C5 ensures the teacher holds pedagogical agency.
6. **Q: What happens if the Gemini API fails or the internet drops?**  
   *A:* `feedbackClient.ts` gracefully falls back to deterministic rule-based keyword matching in `misconceptions.ts`. The response is tagged `📴 Offline feedback` and still passes through the teacher queue.
7. **Q: How did you prevent the LLM from spoiling the answer?**  
   *A:* Both in the system prompt rules ("NEVER give the full answer") and server-side regex validation rejecting phrases like "because it is too hot" or "the answer is".

### Category C: Engineering & Implementation
8. **Q: Why use hand-written SVG instead of a chart library?**  
   *A:* Zero external dependencies, bundle size under 300KB, perfect responsive scaling for projectors, and full explainability during viva inspection.
9. **Q: How do tabs stay synchronised without a backend database?**  
   *A:* `useAppState` hook combines the browser `storage` event with a 2-second background poll against `localStorage`.
10. **Q: How does fair test validation work?**  
    *A:* `evaluateFairTest()` checks changed variables compared to the previous trial. If >1 variable changed, a warning modal triggers and the trial is tagged ⚠️ Unfair.
