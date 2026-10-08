/**
 * Percent positions of the ticks: one per step after `min`, so a 0–1 slider at
 * 0.1 gets exactly 10. `min` itself has no tick — it is always under the thumb
 * or the fill. A step that does not divide the range stops short of `max`, the
 * way the native range input does.
 */
export const getTickPercents = (range: number, step: number): number[] => {
  if (range <= 0 || step <= 0) {
    return [];
  }
  // The epsilon absorbs float error: 1 / 0.1 is 9.999999999999998.
  const count = Math.floor(range / step + 1e-9);
  return Array.from(
    { length: count },
    (_, i) => (((i + 1) * step) / range) * 100,
  );
};

/** Number of decimals in a step, e.g. 2 for 0.05. */
export const getStepPrecision = (step: number): number =>
  (step.toString().split('.')[1] ?? '').length;

/**
 * Clamps a typed value into `[min, max]` and snaps it to the nearest step, the
 * same values the range thumb can take.
 */
export const snapToStep = (
  value: number,
  min: number,
  max: number,
  step: number,
): number => {
  const clamped = Math.min(max, Math.max(min, value));
  if (step <= 0) {
    return clamped;
  }
  // 0.35 / 0.1 is 3.4999999999999996; trimming the ratio first rounds it to 4.
  const steps = Math.round(Number(((clamped - min) / step).toFixed(9)));
  const snapped = min + steps * step;
  // Rounding to the step's precision drops float noise (0.30000000000000004).
  return Number(Math.min(max, snapped).toFixed(getStepPrecision(step)));
};
