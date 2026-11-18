/**
 * Deterministic keyword rules and fallback pedagogical responses for Misconceptions M1 and M2.
 * Used when offline, during network timeout, or when API key is unset.
 */

export interface MisconceptionRuleResult {
  misconception: 'M1' | 'M2' | 'none';
  feedback: string;
  nextHint: string;
}

export function detectMisconceptionsFromText(answerText: string): MisconceptionRuleResult {
  const text = (answerText || '').toLowerCase();

  // M1: "Hotter is always better" / heat-related confusion
  const m1Keywords = ['hot', 'hotter', 'heat', 'warm', 'boiling', 'burn', 'warmth', 'too hot', 'fire'];
  const hasM1 = m1Keywords.some((k) => text.includes(k));

  if (hasM1) {
    return {
      misconception: 'M1',
      feedback:
        'Great thinking! You noticed the heat! Look at your 25°C and 45°C trials again: did the bubbles go up or down when it got very hot?',
      nextHint: 'Test 35°C in the lab to see if mild warmth is better than very hot water.',
    };
  }

  // M2: "Plants make food in the dark / soil gives food"
  const m2Keywords = ['dark', 'night', 'soil', 'shade', 'no light', 'black', 'inside'];
  const hasM2 = m2Keywords.some((k) => text.includes(k));

  if (hasM2) {
    return {
      misconception: 'M2',
      feedback:
        'Nice effort! Think about our Off trial. Can the plant release any bubbles when there is zero light?',
      nextHint: 'Try running a trial with lamp Near (100%) and see what light does!',
    };
  }

  // Generic encouraging inquiry-prompt fallback
  return {
    misconception: 'none',
    feedback:
      'Wonderful effort explaining your thinking! Look closely at the bubbles on your bar chart. What changed between the trials?',
    nextHint: 'Compare your highest bubble trial with your lowest bubble trial.',
  };
}
