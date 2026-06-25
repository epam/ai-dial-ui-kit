import type { FC, ReactNode } from 'react';

import { DialAnalyticsErrorTag } from '@/components/Analytics/ErrorTag/ErrorTag';
import type { AnalyticsBarColorStop } from '@/models/analytics';
import { mergeClasses } from '@/utils/merge-classes';
import {
  DEFAULT_ANALYTICS_BAR_COLOR_MAP,
  getAnalyticsBarColor,
  getAnalyticsBarRatio,
} from './utils';

export interface DialAnalyticsBarProps {
  /** Current value used to size and color the bar. Omit it when `error` is set. */
  value?: number;
  /** Upper bound of the scale. Defaults to `1`. */
  maxValue?: number;
  /**
   * Renders the error state: the bar fills with the error color and an error tag
   * replaces the value label.
   */
  error?: boolean;
  /** Optional label rendered above the bar, on the left. */
  title?: ReactNode;
  /**
   * Text rendered above the bar, on the right. Defaults to `value`.
   * Pass a formatted node (e.g. `"85%"`) to override.
   */
  valueLabel?: ReactNode;
  /**
   * Ordered list of color bands keyed by ratio (value / maxValue).
   * Defaults to {@link DEFAULT_ANALYTICS_BAR_COLOR_MAP}.
   */
  colorMap?: AnalyticsBarColorStop[];
  /** Additional CSS classes for the outer container. */
  className?: string;
  /** Accessible label for the bar. Falls back to the `title` when it is a string. */
  ariaLabel?: string;
}

/**
 * A compact analytics meter: a horizontal bar whose fill width and color reflect a
 * value relative to `maxValue`, with an optional title on the left and value on the right.
 * aliases: MetricBar|Meter|ScoreBar
 *
 * The fill color is resolved from `colorMap` based on the normalized ratio
 * (`value / maxValue`), so the bar shifts hue as the value grows. An empty bar
 * (value `0`) shows only the `bg-layer-1` track.
 *
 * @example
 * ```tsx
 * <DialAnalyticsBar title="Relevance" value={0.82} valueLabel="82%" />
 * ```
 *
 * @example
 * ```tsx
 * <DialAnalyticsBar
 *   title="Score"
 *   value={640}
 *   maxValue={1000}
 *   colorMap={customColorMap}
 * />
 * ```
 *
 * @param [value] - Current value used to size and color the bar. Omit it when `error` is set.
 * @param [maxValue=1] - Upper bound of the scale.
 * @param [error] - Renders the error state (error-colored bar + error tag).
 * @param [title] - Optional label rendered above the bar, on the left.
 * @param [valueLabel] - Text rendered above the bar, on the right. Defaults to `value`.
 * @param [colorMap=DEFAULT_ANALYTICS_BAR_COLOR_MAP] - Color bands keyed by ratio.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [ariaLabel] - Accessible label for the bar.
 */
export const DialAnalyticsBar: FC<DialAnalyticsBarProps> = ({
  value,
  maxValue = 1,
  error,
  title,
  valueLabel,
  colorMap = DEFAULT_ANALYTICS_BAR_COLOR_MAP,
  className,
  ariaLabel,
}) => {
  const ratio = getAnalyticsBarRatio(value ?? 0, maxValue);
  const color = getAnalyticsBarColor(ratio, colorMap);
  const displayValue = valueLabel ?? value;
  const resolvedAriaLabel =
    ariaLabel ?? (typeof title === 'string' ? title : undefined);

  return (
    <div className={mergeClasses('flex flex-col gap-1', className)}>
      <div className="flex flex-row items-center justify-between gap-2">
        <span className="dial-small-text text-primary">{title}</span>
        {error ? (
          <DialAnalyticsErrorTag />
        ) : (
          <span className="dial-small-semi-text text-primary">
            {displayValue}
          </span>
        )}
      </div>
      <div
        role="progressbar"
        aria-valuenow={error ? undefined : value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        aria-label={resolvedAriaLabel}
        className={mergeClasses(
          'h-2 w-full overflow-hidden rounded-sm',
          error ? 'bg-error' : 'bg-layer-1',
        )}
      >
        {!error && (
          <div
            className="h-full rounded-sm transition-[width] duration-300"
            style={{ width: `${ratio * 100}%`, backgroundColor: color }}
          />
        )}
      </div>
    </div>
  );
};
