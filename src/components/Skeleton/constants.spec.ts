import { describe, expect, it } from 'vitest';

import {
  SKELETON_BAR_CLASS_NAME,
  SKELETON_BAR_HEIGHT,
  SKELETON_BAR_WIDTHS,
  SKELETON_CIRCLE_SIZE_CARD,
  SKELETON_CIRCLE_SIZE_LIST,
  SKELETON_SHORT_BAR_WIDTH,
} from './constants';

describe('Dial UI Kit :: Skeleton constants', () => {
  it('matches the sizes of the Patterns 2.0 skeleton instructions', () => {
    expect(SKELETON_BAR_HEIGHT).toBe(20);
    expect(SKELETON_BAR_CLASS_NAME).toBe('rounded-xl');
    expect(SKELETON_CIRCLE_SIZE_LIST).toBe(24);
    expect(SKELETON_CIRCLE_SIZE_CARD).toBe(48);
  });

  it('keeps the short bar inside the 100–150 px the design allows', () => {
    expect(SKELETON_SHORT_BAR_WIDTH).toBeGreaterThanOrEqual(100);
    expect(SKELETON_SHORT_BAR_WIDTH).toBeLessThanOrEqual(150);
  });

  it('varies the bar widths with fixed percentages', () => {
    expect(new Set(SKELETON_BAR_WIDTHS).size).toBeGreaterThan(1);
    SKELETON_BAR_WIDTHS.forEach((width) => expect(width).toMatch(/^\d+%$/));
  });
});
