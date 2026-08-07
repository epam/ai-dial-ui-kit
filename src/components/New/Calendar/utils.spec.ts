import { describe, expect, test } from 'vitest';

import { formatDayAriaLabel } from './utils';

describe('Dial UI Kit :: Calendar utils :: formatDayAriaLabel', () => {
  test('Should include the weekday, day, long month and year', () => {
    const result = formatDayAriaLabel(new Date(2026, 2, 15), 'en-GB');

    expect(result).toBe('Sunday, 15 March 2026');
  });

  test('Should name the month a day belongs to, not the grid it appears in', () => {
    const result = formatDayAriaLabel(new Date(2026, 1, 28), 'en-GB');

    expect(result).toBe('Saturday, 28 February 2026');
  });

  test('Should localize the weekday and month names', () => {
    const result = formatDayAriaLabel(new Date(2026, 2, 15), 'de-DE');

    expect(result).toBe('Sonntag, 15. März 2026');
  });
});
