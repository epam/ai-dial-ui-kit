import type { ReactNode } from 'react';

export interface AnalyticsBarColorStop {
  /** Lower bound of the band (exclusive), as a ratio of value to maxValue (0–1). */
  from: number;
  /** Upper bound of the band (inclusive), as a ratio of value to maxValue (0–1). */
  to: number;
  /** CSS color applied to the fill when the ratio falls within this band. */
  color: string;
}

export interface AnalyticsCardCompareItem {
  /** Sub-title shown above the value in compare mode. */
  title: ReactNode;
  /** The metric value to display. */
  value: ReactNode;
}
