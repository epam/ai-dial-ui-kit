import { describe, expect, test } from 'vitest';
import { getPageRange } from './utils';

describe('getPageRange', () => {
  test('returns empty array when totalPages is 0', () => {
    expect(getPageRange(0)).toEqual([]);
  });

  test('returns empty array when totalPages is negative', () => {
    expect(getPageRange(-5)).toEqual([]);
  });

  test('returns [1] for a single page', () => {
    expect(getPageRange(1)).toEqual([1]);
  });

  test('returns all pages in order', () => {
    expect(getPageRange(5)).toEqual([1, 2, 3, 4, 5]);
  });

  test('returns correct range for larger totalPages', () => {
    expect(getPageRange(10)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });
});
