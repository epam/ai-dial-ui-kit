import type { AnalyticsBarColorStop } from '@/models/analytics';

/**
 * Default color map for {@link DialAnalyticsBar}, expressed as ratios (value / maxValue).
 * A value of `0` leaves the bar empty (track shows through); a value at the maximum
 * uses the dedicated full-bar color.
 */
export const DEFAULT_ANALYTICS_BAR_COLOR_MAP: AnalyticsBarColorStop[] = [
  { from: 0, to: 0.1, color: '#F26B5B' },
  { from: 0.1, to: 0.2, color: '#E5764A' },
  { from: 0.2, to: 0.3, color: '#E08C3F' },
  { from: 0.3, to: 0.4, color: '#D9A638' },
  { from: 0.4, to: 0.5, color: '#D4BE3A' },
  { from: 0.5, to: 0.6, color: '#B8C94A' },
  { from: 0.6, to: 0.7, color: '#7EC96B' },
  { from: 0.7, to: 0.8, color: '#4ECBA8' },
  { from: 0.8, to: 0.9, color: '#4EC5C5' },
  { from: 0.9, to: 1, color: '#4DC87A' },
  { from: 1, to: 1, color: '#30E070' },
];

/**
 * Clamps `value / maxValue` into the `[0, 1]` ratio used to size and color the bar.
 */
export const getAnalyticsBarRatio = (
  value: number,
  maxValue: number,
): number => {
  if (maxValue <= 0) return 0;
  return Math.min(Math.max(value / maxValue, 0), 1);
};

/**
 * Resolves the fill color for a normalized ratio (0–1) from a color map.
 *
 * Returns `undefined` for an empty bar (ratio <= 0) so the track shows through.
 * A band's lower bound is exclusive and its upper bound inclusive, so boundary
 * ratios belong to the lower band. The last matching band wins, which lets an
 * exact full band (`{ from: 1, to: 1 }`) override the band that ends at 1.
 */
export const getAnalyticsBarColor = (
  ratio: number,
  colorMap: AnalyticsBarColorStop[],
): string | undefined => {
  if (ratio <= 0) return undefined;

  let color: string | undefined;
  for (const band of colorMap) {
    const inRange =
      band.from === band.to
        ? ratio >= band.from
        : ratio > band.from && ratio <= band.to;
    if (inRange) color = band.color;
  }
  return color;
};
