/**
 * Percent positions of every value a slider thumb can snap to, from `min` (0)
 * up. A step that does not divide the range stops short of `max`, the way the
 * native range input does.
 */
export const getTickPercents = (range: number, step: number): number[] => {
  if (range <= 0 || step <= 0) {
    return [];
  }
  // The epsilon absorbs float error: 1 / 0.1 is 9.999999999999998.
  const count = Math.floor(range / step + 1e-9);
  return Array.from(
    { length: count + 1 },
    (_, i) => ((i * step) / range) * 100,
  );
};
