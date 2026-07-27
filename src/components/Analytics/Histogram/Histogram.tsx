import type { FC, ReactNode } from 'react';

import { DEFAULT_ANALYTICS_BAR_COLOR_MAP } from '@/components/Analytics/Bar/utils';
import { DialLoader } from '@/components/Loader/Loader';
import { DialTooltip } from '@/components/Tooltip/Tooltip';
import type { AnalyticsBarColorStop } from '@/models/analytics';
import { mergeClasses } from '@/utils/merge-classes';
import type { AnalyticsHistogramColumn } from './utils';
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
  /** Renders a loader in place of the histogram while the data is being fetched. */
  isLoading?: boolean;
  /** Additional CSS classes for the outer container. */
  className?: string;
  /** Second set of values to overlay in compare mode. Primary bars are striped; compare bars are solid. */
  compareValues?: number[];
  /** Label for the primary values set, shown on the first tooltip line in compare mode. */
  valueSetLabel?: string;
  /** Label for the compare values set, shown on the first tooltip line in compare mode. */
  compareValueSetLabel?: string;
}

const formatScoredBetween = (from: number, to: number): string => {
  const interval = formatHistogramColumnLabel(from, to);
  return from === to ? `scored ${interval}` : `scored between ${interval}`;
};

const buildCompareTooltip = (
  setLabel: string | undefined,
  count: number,
  total: number,
  valueTitle: string,
  column: AnalyticsHistogramColumn,
): ReactNode => (
  <div className="flex flex-col gap-0.5">
    {setLabel && <strong>{setLabel}</strong>}
    <span>
      {count} out of {total} {valueTitle}
    </span>
    <span>{formatScoredBetween(column.from, column.to)}</span>
  </div>
);

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
 * @param [isLoading] - Renders a loader in place of the histogram while the data is being fetched.
 * @param [className] - Additional CSS classes for the outer container.
 * @param [compareValues] - Second set of values; enables compare mode (primary striped, compare solid).
 * @param [valueSetLabel] - Label for the primary values set (compare mode tooltip).
 * @param [compareValueSetLabel] - Label for the compare values set (compare mode tooltip).
 */
export const DialAnalyticsHistogram: FC<DialAnalyticsHistogramProps> = ({
  title,
  values,
  colorMap = DEFAULT_ANALYTICS_BAR_COLOR_MAP,
  valueTitle = 'values',
  showCount,
  isLoading,
  className,
  compareValues,
  valueSetLabel,
  compareValueSetLabel,
}) => {
  const rawPrimaryColumns = buildHistogramColumns(values, colorMap);
  const rawCompareColumns = compareValues
    ? buildHistogramColumns(compareValues, colorMap)
    : undefined;

  const globalMax = rawCompareColumns
    ? Math.max(
        0,
        ...[...rawPrimaryColumns, ...rawCompareColumns].map((c) => c.count),
      )
    : undefined;

  const normalize = (
    cols: AnalyticsHistogramColumn[],
  ): AnalyticsHistogramColumn[] =>
    globalMax !== undefined
      ? cols.map((col) => ({
          ...col,
          ratio: globalMax > 0 ? col.count / globalMax : 0,
        }))
      : cols;

  const columns = normalize(rawPrimaryColumns);
  const compareColumns = rawCompareColumns
    ? normalize(rawCompareColumns)
    : undefined;

  const total = values.length;
  const compareTotal = compareValues?.length ?? 0;

  const renderBar = (
    column: AnalyticsHistogramColumn,
    tooltip: ReactNode,
    ariaLabel: string,
    striped: boolean,
  ) => {
    if (column.count === 0) {
      return (
        <div className="flex h-full flex-1 items-end" aria-hidden="true">
          <div
            className="min-h-2 w-full rounded-sm"
            style={{ height: `${column.ratio * 100}%` }}
          />
        </div>
      );
    }

    const stripeStyle = striped
      ? {
          backgroundImage: `repeating-linear-gradient(135deg, ${column.color} 0px, ${column.color} 1px, transparent 1px, transparent 4px)`,
          borderColor: column.color,
        }
      : { backgroundColor: column.color };

    return (
      <DialTooltip
        placement="bottom"
        tooltip={tooltip}
        triggerClassName="flex h-full flex-1 items-end"
      >
        <div
          role="img"
          aria-label={ariaLabel}
          className="flex min-h-2 w-full items-center justify-center rounded-sm border border-transparent"
          style={{ height: `${column.ratio * 100}%`, ...stripeStyle }}
        >
          {showCount && (
            <span className="dial-tiny-semi-text text-primary">
              {column.count}
            </span>
          )}
        </div>
      </DialTooltip>
    );
  };

  return (
    <div className={mergeClasses('flex flex-col gap-2', className)}>
      <span className="dial-small-text text-primary">{title}</span>

      {isLoading ? (
        <div
          className="flex items-center justify-center"
          style={{ height: HISTOGRAM_HEIGHT_PX }}
        >
          <DialLoader fullWidth={false} />
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          <div
            className="flex items-end gap-1 border-b border-primary"
            style={{ height: HISTOGRAM_HEIGHT_PX }}
          >
            {compareColumns
              ? columns.map((column, index) => {
                  const compareCol = compareColumns[index];
                  const primaryLabel = `${column.count} out of ${total} ${valueTitle}`;
                  const compareLabel = `${compareCol.count} out of ${compareTotal} ${valueTitle}`;
                  return (
                    <div key={index} className="flex h-full flex-1 items-end">
                      {renderBar(
                        column,
                        buildCompareTooltip(
                          valueSetLabel,
                          column.count,
                          total,
                          valueTitle,
                          column,
                        ),
                        primaryLabel,
                        true,
                      )}
                      {renderBar(
                        compareCol,
                        buildCompareTooltip(
                          compareValueSetLabel,
                          compareCol.count,
                          compareTotal,
                          valueTitle,
                          compareCol,
                        ),
                        compareLabel,
                        false,
                      )}
                    </div>
                  );
                })
              : columns.map((column, index) => {
                  const label = `${column.count} out of ${total} ${valueTitle}`;

                  if (column.count === 0) {
                    return (
                      <div
                        key={index}
                        className="flex h-full flex-1 items-end"
                        aria-hidden="true"
                      >
                        <div
                          className="min-h-2 w-full rounded-sm"
                          style={{ height: `${column.ratio * 100}%` }}
                        />
                      </div>
                    );
                  }

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
                          'border-transparent',
                        )}
                        style={{
                          height: `${column.ratio * 100}%`,
                          backgroundColor: column.color,
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
      )}
    </div>
  );
};
