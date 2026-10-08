import { describe, expect, test } from 'vitest';

import { getStepPrecision, getTickPercents, snapToStep } from './utils';

describe('Dial UI Kit :: Slider utils :: getTickPercents', () => {
  test('places one tick per step after the start, up to the end', () => {
    expect(getTickPercents(100, 25)).toEqual([25, 50, 75, 100]);
  });

  test('gives exactly 10 ticks for a 0–1 range at 0.1, absorbing float error', () => {
    const ticks = getTickPercents(1, 0.1);

    expect(ticks).toHaveLength(10);
    expect(ticks[0]).toBeCloseTo(10);
    expect(ticks[9]).toBeCloseTo(100);
  });

  test('stops short of the end when the step does not divide the range', () => {
    expect(getTickPercents(10, 4)).toEqual([40, 80]);
  });

  test('returns no ticks for an empty range or a non-positive step', () => {
    expect(getTickPercents(0, 1)).toEqual([]);
    expect(getTickPercents(10, 0)).toEqual([]);
  });
});

describe('Dial UI Kit :: Slider utils :: getStepPrecision', () => {
  test('counts the decimals of the step', () => {
    expect(getStepPrecision(1)).toBe(0);
    expect(getStepPrecision(0.1)).toBe(1);
    expect(getStepPrecision(0.05)).toBe(2);
  });
});

describe('Dial UI Kit :: Slider utils :: snapToStep', () => {
  test('snaps to the nearest step without float noise', () => {
    expect(snapToStep(0.34, 0, 1, 0.1)).toBe(0.3);
    expect(snapToStep(0.35, 0, 1, 0.1)).toBe(0.4);
    expect(snapToStep(0.1 + 0.2, 0, 1, 0.1)).toBe(0.3);
  });

  test('clamps into the range', () => {
    expect(snapToStep(-2, 0, 1, 0.1)).toBe(0);
    expect(snapToStep(7, 0, 1, 0.1)).toBe(1);
  });

  test('snaps relative to min and never past max', () => {
    expect(snapToStep(6, 1, 10, 4)).toBe(5);
    expect(snapToStep(10, 1, 10, 4)).toBe(9);
  });

  test('only clamps for a non-positive step', () => {
    expect(snapToStep(0.37, 0, 1, 0)).toBe(0.37);
  });
});
