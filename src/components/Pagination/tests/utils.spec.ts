import { describe, expect, test } from 'vitest';
import { getPageRange } from '../utils';

describe('getPageRange', () => {
  test('returns empty array when totalPages is 0', () => {
    expect(getPageRange(1, 0, 1)).toEqual([]);
  });

  test('returns empty array when totalPages is negative', () => {
    expect(getPageRange(1, -5, 1)).toEqual([]);
  });

  test('returns all pages when totalPages is below threshold', () => {
    // threshold = siblingCount*2 + 5 = 1*2+5 = 7; totalPages < 7
    expect(getPageRange(1, 6, 1)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('returns all pages when totalPages equals threshold minus 1', () => {
    // threshold = 2*2+5 = 9; totalPages = 8 < 9
    expect(getPageRange(1, 8, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test('no dots: page near start, dots on right side only — returns leading range + last', () => {
    // siblingCount=1, threshold=7, totalPages=10
    // page=2: leftSibling=max(1,1)=1, rightSibling=min(3,10)=3
    // showLeftDots = 1>2 = false, showRightDots = 3<9 = true
    // count = 3+2*1 = 5; range [1..5] + [10]
    expect(getPageRange(2, 10, 1)).toEqual([1, 2, 3, 4, 5, 10]);
  });

  test('no dots: page at start, dots on right side only — returns leading range + last', () => {
    expect(getPageRange(1, 10, 1)).toEqual([1, 2, 3, 4, 5, 10]);
  });

  test('no dots on left, dots on right: siblingCount=2', () => {
    // threshold=9, totalPages=15, page=3
    // leftSibling=max(1,1)=1, rightSibling=min(5,15)=5
    // showLeftDots=1>2=false, showRightDots=5<14=true
    // count=3+4=7; range [1..7] + [15]
    expect(getPageRange(3, 15, 2)).toEqual([1, 2, 3, 4, 5, 6, 7, 15]);
  });

  test('dots on left only: page near end', () => {
    // siblingCount=1, totalPages=10, page=9
    // leftSibling=8, rightSibling=10
    // showLeftDots=8>2=true, showRightDots=10<9=false
    // count=5; range [1] + [6..10]
    expect(getPageRange(9, 10, 1)).toEqual([1, 6, 7, 8, 9, 10]);
  });

  test('dots on left only: page at last', () => {
    expect(getPageRange(10, 10, 1)).toEqual([1, 6, 7, 8, 9, 10]);
  });

  test('dots on left only: siblingCount=2, page near end', () => {
    // totalPages=15, page=13
    // leftSibling=11, rightSibling=15
    // showLeftDots=11>2=true, showRightDots=15<14=false
    // count=7; [1] + [9..15]
    expect(getPageRange(13, 15, 2)).toEqual([1, 9, 10, 11, 12, 13, 14, 15]);
  });

  test('dots on both sides: page in middle', () => {
    // siblingCount=1, totalPages=10, page=5
    // leftSibling=4, rightSibling=6
    // showLeftDots=4>2=true, showRightDots=6<9=true
    // [1] + [4,5,6] + [10]
    expect(getPageRange(5, 10, 1)).toEqual([1, 4, 5, 6, 10]);
  });

  test('dots on both sides: siblingCount=2, page in middle', () => {
    // totalPages=20, page=10
    // leftSibling=8, rightSibling=12
    // showLeftDots=8>2=true, showRightDots=12<19=true
    // [1] + [8,9,10,11,12] + [20]
    expect(getPageRange(10, 20, 2)).toEqual([1, 8, 9, 10, 11, 12, 20]);
  });

  test('dots on both sides: page exactly at left boundary', () => {
    // siblingCount=1, totalPages=10, page=4
    // leftSibling=3, rightSibling=5
    // showLeftDots=3>2=true, showRightDots=5<9=true
    // [1] + [3,4,5] + [10]
    expect(getPageRange(4, 10, 1)).toEqual([1, 3, 4, 5, 10]);
  });

  test('single page always returns that page', () => {
    expect(getPageRange(1, 1, 1)).toEqual([1]);
  });
});
