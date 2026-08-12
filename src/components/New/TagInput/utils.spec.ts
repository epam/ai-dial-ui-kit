import { describe, expect, test } from 'vitest';

import { getVisibleTagCount } from './utils';

const gap = 4;
const overflowChipWidth = 34;

describe('Dial UI Kit :: TagInput :: getVisibleTagCount', () => {
  test('reports every tag as visible before layout has run', () => {
    expect(
      getVisibleTagCount({
        availableWidth: 0,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(3);
  });

  test('keeps every tag when they all fit', () => {
    expect(
      getVisibleTagCount({
        availableWidth: 200,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(3);
  });

  test('does not reserve room for the overflow chip when nothing overflows', () => {
    // 3 * (50 + 4) = 162 exactly; adding the chip would not fit, but it is not
    // rendered either.
    expect(
      getVisibleTagCount({
        availableWidth: 162,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(3);
  });

  test('drops the tags that do not fit', () => {
    // 120 holds two tags (108) but not three (162); the chip fits in the rest.
    expect(
      getVisibleTagCount({
        availableWidth: 150,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(2);
  });

  test('gives up a further tag when the overflow chip does not fit beside it', () => {
    // Two tags fit (108 of 120), but 108 + 34 > 120, so one has to go.
    expect(
      getVisibleTagCount({
        availableWidth: 120,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(1);
  });

  test('hides every tag when not even one fits beside the chip', () => {
    expect(
      getVisibleTagCount({
        availableWidth: 60,
        tagWidths: [50, 50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(0);
  });

  test('hides every tag when the first one is wider than the row', () => {
    expect(
      getVisibleTagCount({
        availableWidth: 40,
        tagWidths: [50, 50],
        overflowChipWidth,
        gap,
      }),
    ).toBe(0);
  });

  test('handles an empty tag list', () => {
    expect(
      getVisibleTagCount({
        availableWidth: 200,
        tagWidths: [],
        overflowChipWidth,
        gap,
      }),
    ).toBe(0);
  });

  test('measures each tag on its own width', () => {
    // 20 + 4 + 30 + 4 = 58 fits in 100, adding the 80 wide tag does not, and
    // the chip still fits in the remaining 42.
    expect(
      getVisibleTagCount({
        availableWidth: 100,
        tagWidths: [20, 30, 80],
        overflowChipWidth,
        gap,
      }),
    ).toBe(2);
  });
});
