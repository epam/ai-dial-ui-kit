import { describe, expect, test } from 'vitest';
import {
  getPageRange,
  getPageDisplayType,
  MANY_PAGES_THRESHOLD,
  ADJACENT_WINDOW,
} from '../utils';

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

describe('getPageDisplayType', () => {
  const threshold = MANY_PAGES_THRESHOLD;
  const window = ADJACENT_WINDOW;

  test('active page always returns "active"', () => {
    expect(getPageDisplayType(3, 3, 6)).toBe('active');
    expect(getPageDisplayType(5, 5, 10)).toBe('active');
  });

  test('all non-active pages return "adjacent" when totalPages < threshold', () => {
    const total = threshold - 1;
    for (let p = 1; p <= total; p++) {
      if (p !== 3) {
        expect(getPageDisplayType(p, 3, total)).toBe('adjacent');
      }
    }
  });

  test('pages within ADJACENT_WINDOW return "adjacent" when totalPages >= threshold', () => {
    const total = threshold;
    const currentPage = 4;
    for (let offset = 1; offset <= window; offset++) {
      expect(getPageDisplayType(currentPage - offset, currentPage, total)).toBe('adjacent');
      expect(getPageDisplayType(currentPage + offset, currentPage, total)).toBe('adjacent');
    }
  });

  test('pages beyond ADJACENT_WINDOW return "far" when totalPages >= threshold', () => {
    const total = threshold;
    const currentPage = 4;
    expect(getPageDisplayType(currentPage - (window + 1), currentPage, total)).toBe('far');
    expect(getPageDisplayType(currentPage + (window + 1), currentPage, total)).toBe('far');
  });

  test('boundary: page exactly at ADJACENT_WINDOW distance returns "adjacent"', () => {
    expect(getPageDisplayType(3, 5, 10)).toBe('adjacent');
    expect(getPageDisplayType(7, 5, 10)).toBe('adjacent');
  });

  test('boundary: page one beyond ADJACENT_WINDOW distance returns "far"', () => {
    expect(getPageDisplayType(2, 5, 10)).toBe('far');
    expect(getPageDisplayType(8, 5, 10)).toBe('far');
  });
});
