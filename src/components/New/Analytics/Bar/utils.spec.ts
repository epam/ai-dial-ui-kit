import { describe, expect, test } from 'vitest';
import {
  DEFAULT_ANALYTICS_BAR_COLOR_MAP,
  getAnalyticsBarColor,
  getAnalyticsBarRatio,
} from './utils';

describe('Dial UI Kit :: DialAnalyticsBar utils', () => {
  describe('getAnalyticsBarRatio', () => {
    test('normalizes value against maxValue', () => {
      expect(getAnalyticsBarRatio(0.5, 1)).toBe(0.5);
      expect(getAnalyticsBarRatio(250, 1000)).toBe(0.25);
    });

    test('clamps to [0, 1]', () => {
      expect(getAnalyticsBarRatio(-5, 1)).toBe(0);
      expect(getAnalyticsBarRatio(2, 1)).toBe(1);
    });

    test('returns 0 for non-positive maxValue', () => {
      expect(getAnalyticsBarRatio(5, 0)).toBe(0);
      expect(getAnalyticsBarRatio(5, -1)).toBe(0);
    });
  });

  describe('getAnalyticsBarColor', () => {
    const map = DEFAULT_ANALYTICS_BAR_COLOR_MAP;

    test('returns undefined (empty) at ratio 0', () => {
      expect(getAnalyticsBarColor(0, map)).toBeUndefined();
      expect(getAnalyticsBarColor(-1, map)).toBeUndefined();
    });

    test('picks the band the ratio falls into', () => {
      expect(getAnalyticsBarColor(0.05, map)).toBe('#F26B5B');
      expect(getAnalyticsBarColor(0.45, map)).toBe('#D4BE3A');
      expect(getAnalyticsBarColor(0.95, map)).toBe('#4DC87A');
    });

    test('treats the upper bound as inclusive (boundary belongs to lower band)', () => {
      expect(getAnalyticsBarColor(0.1, map)).toBe('#F26B5B');
      expect(getAnalyticsBarColor(0.2, map)).toBe('#E5764A');
    });

    test('uses the dedicated full color at ratio 1', () => {
      expect(getAnalyticsBarColor(1, map)).toBe('#30E070');
    });

    test('supports a custom color map', () => {
      const custom = [
        { from: 0, to: 0.5, color: 'red' },
        { from: 0.5, to: 1, color: 'green' },
      ];
      expect(getAnalyticsBarColor(0.25, custom)).toBe('red');
      expect(getAnalyticsBarColor(0.75, custom)).toBe('green');
    });
  });
});
