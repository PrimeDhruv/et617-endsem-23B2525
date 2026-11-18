import { Setup, Variable } from '../types';

/**
 * Detects which variables changed between the previous and current setups.
 */
export function detectChangedVariables(current: Setup, previous?: Setup): Variable[] {
  if (!previous) return [];
  const changed: Variable[] = [];

  if (current.light !== previous.light) {
    changed.push('light');
  }
  if (current.temp !== previous.temp) {
    changed.push('temp');
  }
  if (current.co2 !== previous.co2) {
    changed.push('co2');
  }

  return changed;
}

/**
 * Fair-test evaluator:
 * In a fair scientific test, only ONE variable should change at a time while others are held constant.
 * The first trial is always considered fair (serves as the baseline).
 * If 0 or 1 variable changed, fair = true. If 2 or 3 changed, fair = false.
 */
export function evaluateFairTest(
  current: Setup,
  previous?: Setup
): { changed: Variable[]; fair: boolean } {
  if (!previous) {
    return {
      changed: [],
      fair: true,
    };
  }

  const changed = detectChangedVariables(current, previous);
  return {
    changed,
    fair: changed.length <= 1,
  };
}

/**
 * Generates user-friendly explanation text for fair test status
 */
export function getFairTestExplanation(changed: Variable[], isSeedling: boolean = false): string {
  if (changed.length <= 1) {
    return '✅ Fair test! Only one factor was changed.';
  }

  const varNames = changed.map((v) => {
    if (v === 'light') return 'light';
    if (v === 'temp') return 'warmth';
    return 'baking soda';
  });

  if (isSeedling) {
    return `You changed ${varNames.join(' and ')}. Let's test just one so we know what helped the plant! 🌱`;
  }

  return `You changed ${varNames.join(' AND ')}. If the bubbles change, which one caused it? 🤔`;
}
