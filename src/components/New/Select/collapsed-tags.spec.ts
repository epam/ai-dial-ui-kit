import { describe, expect, it } from 'vitest';

import { countFittingTags } from './collapsed-tags';

const base = { counterWidth: 40, gap: 8 };

describe('countFittingTags', () => {
  it('shows every tag before the row has been laid out', () => {
    expect(
      countFittingTags({ ...base, tagWidths: [100, 100], available: 0 }),
    ).toBe(2);
  });

  it('shows every tag when they all fit, without reserving the counter', () => {
    expect(
      countFittingTags({ ...base, tagWidths: [100, 100], available: 208 }),
    ).toBe(2);
  });

  it('folds the tags that do not fit, leaving room for the counter', () => {
    // 100 + 8 + 100 = 208 fits, but with the counter (+ 8 + 40) it does not.
    expect(
      countFittingTags({ ...base, tagWidths: [100, 100, 100], available: 250 }),
    ).toBe(1);
    expect(
      countFittingTags({ ...base, tagWidths: [100, 100, 100], available: 260 }),
    ).toBe(2);
  });

  it('stops at the first tag that does not fit, keeping the order', () => {
    expect(
      countFittingTags({ ...base, tagWidths: [60, 400, 60], available: 200 }),
    ).toBe(1);
  });

  it('keeps one tag even when nothing fits', () => {
    expect(
      countFittingTags({ ...base, tagWidths: [300, 300], available: 120 }),
    ).toBe(1);
  });

  it('returns 0 for no tags', () => {
    expect(countFittingTags({ ...base, tagWidths: [], available: 200 })).toBe(
      0,
    );
  });
});
