import { describe, expect, test } from 'vitest';
import {
  baseColumnComparator,
  checkColDefsChanges,
} from './base-column-comparator';
import type { ColDef } from 'ag-grid-community';

describe('Dial UI Kit :: baseColumnComparator', () => {
  test('returns 0 when values are identical', () => {
    expect(baseColumnComparator('apple', 'apple')).toBe(0);
    expect(baseColumnComparator(42, 42)).toBe(0);
    expect(baseColumnComparator('', '')).toBe(0);
  });

  test('compares strings case-insensitively', () => {
    expect(baseColumnComparator('Apple', 'apple')).toBe(0);
    expect(baseColumnComparator('BANANA', 'banana')).toBe(0);
    expect(baseColumnComparator('aaa', 'AAA')).toBe(0);
  });

  test('handles undefined values correctly', () => {
    expect(baseColumnComparator(undefined, 'apple')).toBe(1);
    expect(
      baseColumnComparator(undefined, 'apple', undefined, undefined, true),
    ).toBe(-1);

    expect(baseColumnComparator('apple', undefined)).toBe(-1);
    expect(
      baseColumnComparator('apple', undefined, undefined, undefined, true),
    ).toBe(1);

    expect(baseColumnComparator(undefined, undefined)).toBe(0);
  });

  test('handles null/empty values correctly', () => {
    expect(baseColumnComparator('', 'apple')).toBe(1);
    expect(baseColumnComparator('apple', '')).toBe(-1);

    expect(baseColumnComparator('apple', 'banana')).toBe(-1);
    expect(baseColumnComparator('banana', 'apple')).toBe(1);
  });

  test('compares numbers correctly', () => {
    expect(baseColumnComparator(5, 10)).toBe(-1);
    expect(baseColumnComparator(10, 5)).toBe(1);
    expect(baseColumnComparator(-5, 5)).toBe(-1);
  });

  test('respects isInverted parameter', () => {
    expect(baseColumnComparator('apple', 'banana')).toBe(-1);
    expect(baseColumnComparator(5, 10)).toBe(-1);

    expect(
      baseColumnComparator('apple', 'banana', undefined, undefined, true),
    ).toBe(-1);
    expect(
      baseColumnComparator(undefined, 'apple', undefined, undefined, true),
    ).toBe(-1);
    expect(
      baseColumnComparator('apple', undefined, undefined, undefined, true),
    ).toBe(1);
  });
});

describe('Dial UI Kit :: checkColDefsChanges', () => {
  test('returns false when column definitions are identical', () => {
    const cols: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'age', headerName: 'Age' },
    ];

    expect(checkColDefsChanges(cols, cols)).toBe(false);

    const colsCopy = JSON.parse(JSON.stringify(cols));
    expect(checkColDefsChanges(cols, colsCopy)).toBe(false);
  });

  test('returns true when field names are different', () => {
    const cols1: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'age', headerName: 'Age' },
    ];

    const cols2: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'birthday', headerName: 'Birthday' },
    ];

    expect(checkColDefsChanges(cols1, cols2)).toBe(true);
  });

  test('returns true when hide property changes', () => {
    const cols1: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'age', headerName: 'Age', hide: false },
    ];

    const cols2: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'age', headerName: 'Age', hide: true },
    ];

    expect(checkColDefsChanges(cols1, cols2)).toBe(true);
  });

  test('ignores changes to properties other than field and hide', () => {
    const cols1: ColDef[] = [
      { field: 'name', headerName: 'Name' },
      { field: 'age', headerName: 'Age', width: 100 },
    ];

    const cols2: ColDef[] = [
      { field: 'name', headerName: 'Full Name' },
      { field: 'age', headerName: 'Age', width: 150 },
    ];

    expect(checkColDefsChanges(cols1, cols2)).toBe(false);
  });

  test('handles empty arrays', () => {
    expect(checkColDefsChanges([], [])).toBe(false);
  });
});
