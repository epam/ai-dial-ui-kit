import type { AnalyticsBarColorStop } from '@/models/analytics';

/** Fill color for the zero-bucket column (values of exactly `0`). */
export const ZERO_BUCKET_COLOR = '#FF4E50';

export interface AnalyticsHistogramColumn {
  /** Lower bound of the column's interval. */
  from: number;
  /** Upper bound of the column's interval. */
  to: number;
  /** Fill color for the column, or `undefined` for the empty zero bucket. */
  color?: string;
  /** Number of values that fall into this column's interval. */
  count: number;
  /** Column height as a ratio of the tallest column (0–1). */
  ratio: number;
  /** Whether this is the leading empty bucket for values of exactly `0`. */
  isZeroBucket: boolean;
}

/**
 * Returns the index of the color-map band a positive value belongs to, or `-1`
 * when no band matches (including an empty map or a value of `0`, which is handled
 * by the dedicated zero bucket). A band's lower bound is exclusive and its upper
 * bound inclusive, so boundary values belong to the lower band; the last matching
 * band wins, which lets an exact full band (`{ from: 1, to: 1 }`) capture the maximum.
 */
export const getHistogramColumnIndex = (
  value: number,
  colorMap: AnalyticsBarColorStop[],
): number => {
  let index = -1;
  colorMap.forEach((band, i) => {
    const inRange =
      band.from === band.to
        ? value >= band.from
        : value > band.from && value <= band.to;
    if (inRange) index = i;
  });
  return index;
};

/**
 * Builds the histogram columns: a leading empty zero bucket (values of exactly `0`)
 * followed by one column per color-map band. Counts how many `values` fall into each
 * column and computes each column's height as a ratio of the tallest column.
 */
export const buildHistogramColumns = (
  values: number[],
  colorMap: AnalyticsBarColorStop[],
): AnalyticsHistogramColumn[] => {
  const bandCounts = colorMap.map(() => 0);
  let zeroCount = 0;

  values.forEach((value) => {
    if (value <= 0) {
      zeroCount += 1;
      return;
    }
    const index = getHistogramColumnIndex(value, colorMap);
    if (index >= 0) bandCounts[index] += 1;
  });

  const maxCount = Math.max(0, zeroCount, ...bandCounts);
  const toRatio = (count: number) => (maxCount > 0 ? count / maxCount : 0);

  const zeroColumn: AnalyticsHistogramColumn = {
    from: 0,
    to: 0,
    color: ZERO_BUCKET_COLOR,
    count: zeroCount,
    ratio: toRatio(zeroCount),
    isZeroBucket: true,
  };

  const bandColumns: AnalyticsHistogramColumn[] = colorMap.map((band, i) => ({
    from: band.from,
    to: band.to,
    color: band.color,
    count: bandCounts[i],
    ratio: toRatio(bandCounts[i]),
    isZeroBucket: false,
  }));

  return [zeroColumn, ...bandColumns];
};

/** Formats a column's interval bound for the axis label (trims float noise). */
export const formatHistogramInterval = (value: number): string =>
  `${Math.round(value * 100) / 100}`;

/**
 * Builds the legend label for a column: a single number for an exact band
 * (`from === to`, e.g. the full band), otherwise a `from-to` range.
 * For the default map this yields `0-0.1, 0.1-0.2, …, 0.9-1, 1`.
 */
export const formatHistogramColumnLabel = (
  from: number,
  to: number,
): string => {
  if (from === to) {
    return formatHistogramInterval(from);
  }
  return `${formatHistogramInterval(from)}-${formatHistogramInterval(to)}`;
};
