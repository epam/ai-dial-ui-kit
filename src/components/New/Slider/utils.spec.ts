import { describe, expect, test } from 'vitest';

import { getTickPercents } from './utils';

describe('Dial UI Kit :: Slider utils :: getTickPercents', () => {
  test('places one tick per step, from the start to the end', () => {
    expect(getTickPercents(100, 25)).toEqual([0, 25, 50, 75, 100]);
  });

  test('absorbs float error, so 0.1 steps reach the end of a 0–1 range', () => {
    const ticks = getTickPercents(1, 0.1);

    expect(ticks).toHaveLength(11);
    expect(ticks[10]).toBeCloseTo(100);
  });

  test('stops short of the end when the step does not divide the range', () => {
    expect(getTickPercents(10, 4)).toEqual([0, 40, 80]);
  });

  test('returns no ticks for an empty range or a non-positive step', () => {
    expect(getTickPercents(0, 1)).toEqual([]);
    expect(getTickPercents(10, 0)).toEqual([]);
  });
});
