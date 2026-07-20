import { describe, expect, test } from 'vitest';
import {
  buildHistogramColumns,
  formatHistogramColumnLabel,
  formatHistogramInterval,
  getHistogramColumnIndex,
} from './utils';
import { DEFAULT_ANALYTICS_BAR_COLOR_MAP } from '@/components/Analytics/Bar/utils';

const map = DEFAULT_ANALYTICS_BAR_COLOR_MAP;

describe('Dial UI Kit :: DialAnalyticsHistogram utils', () => {
  describe('getHistogramColumnIndex', () => {
    test('returns -1 for an empty map', () => {
      expect(getHistogramColumnIndex(0.5, [])).toBe(-1);
    });

    test('returns -1 for 0 (handled by the zero bucket)', () => {
      expect(getHistogramColumnIndex(0, map)).toBe(-1);
      expect(getHistogramColumnIndex(-1, map)).toBe(-1);
    });

    test('treats the upper bound as inclusive (boundary belongs to lower band)', () => {
      expect(getHistogramColumnIndex(0.1, map)).toBe(0);
      expect(getHistogramColumnIndex(0.2, map)).toBe(1);
    });

    test('bins the exact maximum into the dedicated full column', () => {
      // last band {from:1,to:1} is index 10
      expect(getHistogramColumnIndex(1, map)).toBe(10);
      expect(getHistogramColumnIndex(0.99, map)).toBe(9);
    });
  });

  describe('buildHistogramColumns', () => {
    test('prepends a zero bucket before the band columns', () => {
      const columns = buildHistogramColumns([], map);
      expect(columns).toHaveLength(map.length + 1);
      expect(columns[0]).toMatchObject({
        from: 0,
        to: 0,
        color: '#FF4E50',
        isZeroBucket: true,
      });
    });

    test('counts values per band and scales height to the tallest', () => {
      // band column i lives at columns[i + 1]; columns[0] is the zero bucket
      const columns = buildHistogramColumns([0, 0.05, 0.06, 0.45, 1], map);

      expect(columns[0].count).toBe(1); // zero bucket: the single 0
      expect(columns[1].count).toBe(2); // 0.05, 0.06 -> band {0,0.1}
      expect(columns[5].count).toBe(1); // 0.45 -> band {0.4,0.5}
      expect(columns[11].count).toBe(1); // 1 -> full band

      expect(columns[1].ratio).toBe(1); // tallest
      expect(columns[5].ratio).toBe(0.5);
      expect(columns[2].count).toBe(0);
      expect(columns[2].ratio).toBe(0);
    });

    test('keeps 0 out of the first band and in the zero bucket', () => {
      const columns = buildHistogramColumns([0, 0, 0.05], map);
      expect(columns[0].count).toBe(2); // zero bucket
      expect(columns[1].count).toBe(1); // band {0,0.1}
    });

    test('returns all-zero columns for empty input', () => {
      const columns = buildHistogramColumns([], map);
      expect(columns.every((c) => c.count === 0 && c.ratio === 0)).toBe(true);
    });

    test('carries band color and bounds', () => {
      const columns = buildHistogramColumns([0.05], map);
      expect(columns[1]).toMatchObject({ from: 0, to: 0.1, color: '#F26B5B' });
    });
  });

  describe('formatHistogramInterval', () => {
    test('formats clean numbers and trims float noise', () => {
      expect(formatHistogramInterval(0)).toBe('0');
      expect(formatHistogramInterval(0.1)).toBe('0.1');
      expect(formatHistogramInterval(1)).toBe('1');
      expect(formatHistogramInterval(0.30000000000000004)).toBe('0.3');
    });
  });

  describe('formatHistogramColumnLabel', () => {
    test('shows a single number for an exact band, a range otherwise', () => {
      expect(formatHistogramColumnLabel(0, 0.1)).toBe('0-0.1');
      expect(formatHistogramColumnLabel(0.1, 0.2)).toBe('0.1-0.2');
      expect(formatHistogramColumnLabel(0.9, 1)).toBe('0.9-1');
      expect(formatHistogramColumnLabel(1, 1)).toBe('1');
    });

    test('matches the default map legend', () => {
      const labels = map.map((b) => formatHistogramColumnLabel(b.from, b.to));
      expect(labels).toEqual([
        '0-0.1',
        '0.1-0.2',
        '0.2-0.3',
        '0.3-0.4',
        '0.4-0.5',
        '0.5-0.6',
        '0.6-0.7',
        '0.7-0.8',
        '0.8-0.9',
        '0.9-1',
        '1',
      ]);
    });
  });
});
