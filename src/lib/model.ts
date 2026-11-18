import { Setup, Variable } from '../types';

/**
 * Temperature factor curve:
 * 10°C: slow enzyme action (0.4)
 * 25°C: optimal physiological rate (1.0)
 * 35°C: near-optimal warmth (0.9)
 * 45°C: biological heat stress / denaturation (0.3)
 */
export const tempFactor: Record<Setup['temp'], number> = {
  10: 0.4,
  25: 1.0,
  35: 0.9,
  45: 0.3,
};

/**
 * Carbon dioxide (baking soda / NaHCO3) factor:
 * 0 spoons: minimal dissolved CO2 in water (0.3)
 * 1 spoon: moderate supply (0.6)
 * 2 spoons: generous supply (0.85)
 * 3 spoons: saturated supply (1.0)
 */
export const co2Factor: Record<Setup['co2'], number> = {
  0: 0.3,
  1: 0.6,
  2: 0.85,
  3: 1.0,
};

/**
 * Default laboratory setup:
 * Moderate light (60%), room temperature (25°C), 2 spoons of baking soda.
 */
export const DEFAULT_SETUP: Setup = {
  light: 60,
  temp: 25,
  co2: 2,
};

/**
 * Pure simulation function calculating oxygen bubbles produced per minute.
 * Limiting-factor concept: photosynthesis rate is capped by whichever essential input (light or CO2) is in shortest supply.
 */
export function bubblesPerMinute(s: Setup): number {
  // If there is zero light, photosynthesis cannot occur regardless of temperature or nutrients
  if (s.light === 0) return 0;

  // Law of limiting factors: the rate is restricted by the least abundant resource (light intensity vs CO2 availability)
  const limiting = Math.min(s.light / 100, co2Factor[s.co2]);

  // Rate scales with limiting factor and temperature enzyme efficiency, rounded to integer bubbles
  return Math.round(20 * limiting * tempFactor[s.temp]);
}

/**
 * Human-readable variable labels and icons
 */
export const VARIABLE_INFO: Record<Variable, { label: string; icon: string; unit: string }> = {
  light: { label: 'Light', icon: '☀️', unit: '%' },
  temp: { label: 'Warmth', icon: '🌡️', unit: '°C' },
  co2: { label: 'Baking Soda', icon: '🫧', unit: 'spoons' },
};
