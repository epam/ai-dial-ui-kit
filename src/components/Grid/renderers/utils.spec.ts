import { describe, it, expect } from 'vitest';
import { convertToDate } from './utils';

describe('convertToDate', () => {
  it('returns null for undefined and null', () => {
    expect(convertToDate(undefined)).toBeNull();
    expect(convertToDate(null as unknown as any)).toBeNull();
  });

  it('returns the same Date instance when given a valid Date', () => {
    const d = new Date(1700000000000);
    const result = convertToDate(d);
    expect(result).toBe(d); // same reference
    expect(result?.getTime()).toBe(1700000000000);
  });

  it('returns null for an invalid Date instance', () => {
    const invalid = new Date('not-a-date');
    expect(Number.isNaN(invalid.getTime())).toBe(true);
    expect(convertToDate(invalid as unknown as Date)).toBeNull();
  });

  it('parses a valid number timestamp (ms since epoch)', () => {
    const ms = 1700000000000;
    const result = convertToDate(ms);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ms);
  });

  it('returns null for NaN and Infinity numbers', () => {
    expect(convertToDate(Number.NaN as unknown as number)).toBeNull();
    expect(
      convertToDate(Number.POSITIVE_INFINITY as unknown as number),
    ).toBeNull();
    expect(
      convertToDate(Number.NEGATIVE_INFINITY as unknown as number),
    ).toBeNull();
  });

  it('parses a numeric string by delegating to number branch', () => {
    const ms = 1700000000000;
    const result = convertToDate(String(ms));
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ms);
  });

  it('trims whitespace around a numeric string', () => {
    const ms = 1700000000000;
    const result = convertToDate(`  \n ${ms}\t `);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ms);
  });

  it('parses a negative numeric string', () => {
    const ms = -86400000;
    const result = convertToDate(String(ms));
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(ms);
  });

  it('parses an ISO-like date string', () => {
    const iso = '2024-02-20';
    const expected = new Date(iso).getTime();
    const result = convertToDate(iso);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(expected);
  });

  it('returns null for a non-parsable string', () => {
    expect(convertToDate('totally-not-a-date')).toBeNull();
  });
});
