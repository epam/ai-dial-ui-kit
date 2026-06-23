import type { FC, ReactNode } from 'react';

import { DEFAULT_ANALYTICS_BAR_COLOR_MAP } from '@/components/Analytics/Bar/utils';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type { AnalyticsBarColorStop } from '@/models/analytics';
import { mergeClasses } from '@/utils/merge-classes';
import { buildHistogramColumns, formatHistogramColumnLabel } from './utils';

const HISTOGRAM_HEIGHT_PX = 128;

export interface DialAnalyticsHistogramProps {
  /** Title rendered above the histogram. */
  title: ReactNode;
  /** Values to distribute across the columns. */
  values: number[];
  /**
   * Ordered color bands defining the columns (and their colors), keyed by value.
   * Defaults to {@link DEFAULT_ANALYTICS_BAR_COLOR_MAP}.
   */
  colorMap?: AnalyticsBarColorStop[];
  /** Noun used in the hover tooltip: `"{n} out of {k} {valueTitle}"`. */
  valueTitle?: string;
  /** When `true`, renders each column's count inside its bar. */
  showCount?: boolean;
  /** Additional CSS classes for the outer container. */
  className?: string;
}

/**
 * A histogram that distributes `values` across the bands of a color map and draws a
 * column per band. Each column's height is relative to the most populated band; empty
 * columns are outlined, populated columns are filled with their band color. A baseline
 * separates the columns from the interval labels, and hovering a column reveals a
 * tooltip with its share of the total.
 * aliases: Distribution|ColumnChart|FrequencyChart
 *
 * @example
 * ```tsx
 * <DialAnalyticsHistogram
 *   title="Score distribution"
 *   values={[0.1, 0.15, 0.4, 0.42, 0.43, 0.9, 1]}
 *   valueTitle="responses"
 * />
 * ```
 *
 * @param title - Title rendered above the histogram.
 * @param values - Values to distribute across the columns.
 * @param [colorMap=DEFAULT_ANALYTICS_BAR_COLOR_MAP] - Color bands defining the columns.
 * @param [valueTitle='values'] - Noun used in the hover tooltip.
 * @param [showCount] - When `true`, renders each column's count inside its bar.
 * @param [className] - Additional CSS classes for the outer container.
 */
export const DialAnalyticsHistogram: FC<DialAnalyticsHistogramProps> = ({
  title,
  values,
  colorMap = DEFAULT_ANALYTICS_BAR_COLOR_MAP,
  valueTitle = 'values',
  showCount,
  className,
}) => {
  const columns = buildHistogramColumns(values, colorMap);
  const total = values.length;

  return (
    <div className={mergeClasses('flex flex-col gap-2', className)}>
      <span className="dial-small-text text-primary">{title}</span>

      <div className="flex flex-col gap-1">
        <div
          className="flex items-end gap-1 border-b border-primary"
          style={{ height: HISTOGRAM_HEIGHT_PX }}
        >
          {columns.map((column, index) => {
            const colored = !column.isZeroBucket && column.count > 0;
            const label = `${column.count} out of ${total} ${valueTitle}`;
            return (
              <DialTooltip
                key={index}
                placement="bottom"
                tooltip={label}
                triggerClassName="flex h-full flex-1 items-end"
              >
                <div
                  role="img"
                  aria-label={label}
                  className={mergeClasses(
                    'flex min-h-2 w-full items-center justify-center rounded-sm border',
                    column.isZeroBucket
                      ? 'border-secondary'
                      : colored
                        ? 'border-transparent'
                        : 'border-primary',
                  )}
                  style={{
                    height: `${column.ratio * 100}%`,
                    backgroundColor: colored ? column.color : undefined,
                  }}
                >
                  {showCount && column.count > 0 && (
                    <span className="dial-tiny-semi-text text-primary">
                      {column.count}
                    </span>
                  )}
                </div>
              </DialTooltip>
            );
          })}
        </div>

        <div className="flex gap-1">
          {columns.map((column, index) => (
            <span
              key={index}
              className="dial-caption-text flex-1 text-center text-secondary"
            >
              {formatHistogramColumnLabel(column.from, column.to)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
