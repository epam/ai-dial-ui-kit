import type { FC, ReactNode } from 'react';

import { DialAnalyticsErrorTag } from '@/components/Analytics/ErrorTag/ErrorTag';
import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { DialLoader } from '@/components/Loader/Loader';
import type { AnalyticsCardCompareItem } from '@/models/analytics';
import { AnalyticsCardVariant } from '@/types/analytics';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialAnalyticsCardProps {
  title: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
  variant?: AnalyticsCardVariant;
  /** Renders an error tag in place of the value when the value is unavailable. */
  error?: boolean;
  /** Renders a loader in place of the value while the value is being fetched. */
  isLoading?: boolean;
  /** Additional CSS classes for the outer container. */
  className?: string;
  /**
   * When provided, shows a delta badge next to the title.
   * Values ≥ 0 use `bg-success text-success`; negative values use error styles.
   * Positive values are prefixed with `+`.
   */
  delta?: number;
  /**
   * Overrides the automatic sign-based style of the delta badge.
   * Use when a positive delta is semantically bad (e.g. response time went up)
   * or a negative delta is semantically good (e.g. error rate went down).
   * When omitted, `delta ≥ 0` → success, `delta < 0` → error.
   */
  deltaPositive?: boolean;
  /**
   * Suffix appended to the formatted delta with no space (e.g. `"s"` → `+9s`,
   * `-19s`). Any string is valid (`s`, `ms`, `%`).
   */
  deltaUnit?: string;
  /**
   * When provided, enables compare mode: the value area is split 50/50 with a
   * vertical divider and each side shows its own sub-title and value.
   * `value` is ignored when `compareValues` is set.
   */
  compareValues?: [AnalyticsCardCompareItem, AnalyticsCardCompareItem];
}

const variantStyles: Record<
  AnalyticsCardVariant,
  {
    container: string;
    title: string;
    value: string;
    showDescription: boolean;
  }
> = {
  [AnalyticsCardVariant.Default]: {
    container: 'bg-layer-3',
    title: 'dial-small-text text-secondary',
    value: 'dial-display2-text text-primary',
    showDescription: true,
  },
  [AnalyticsCardVariant.Compact]: {
    container: 'bg-layer-2',
    title: 'dial-tiny-text text-secondary',
    value: 'dial-body-semi-text text-primary',
    showDescription: false,
  },
};

/**
 * A simple analytics summary card that displays a single metric as a title,
 * a prominent value, and an optional description.
 * aliases: MetricCard|StatCard|KpiCard
 * Design system 1.0
 *
 * Two visual variants are available via the {@link AnalyticsCardVariant} enum:
 * - `Default` — `bg-layer-3`, large `dial-display2-text` value, supports a description.
 * - `Compact` — denser `bg-layer-2` card with a `dial-body-semi-text` value and no
 *   description (the `description` prop is ignored in this variant).
 *
 * **Compare mode** — pass `compareValues` to split the value area 50/50 between two
 * metrics, each with its own sub-title. Long sub-titles truncate to a single line and
 * show the full text in a tooltip. Pair with `delta` to show a change badge next
 * to the card title, and `deltaUnit` for a suffix such as `"s"`.
 *
 * @example
 * ```tsx
 * <DialAnalyticsCard
 *   title="Total requests"
 *   value="12,480"
 *   description="+12% vs last week"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DialAnalyticsCard
 *   title="Response time"
 *   delta={9}
 *   deltaUnit="s"
 *   deltaPositive={false}
 *   compareValues={[
 *     { title: 'This week', value: '248ms' },
 *     { title: 'Last week', value: '220ms' },
 *   ]}
 * />
 * ```
 *
 * @param title - Short label describing the metric, rendered above the value.
 * @param [value] - The primary metric value. Ignored when `compareValues` is set.
 * @param [description] - Optional supporting text. Ignored when `variant` is `Compact`.
 * @param [variant=AnalyticsCardVariant.Default] - Visual style of the card.
 * @param [error] - Renders an error tag in place of the value.
 * @param [isLoading] - Renders a loader in place of the value.
 * @param [className] - Additional CSS classes for the card container.
 * @param [delta] - Numeric change shown as a badge next to the title. ≥0 = success, <0 = error.
 * @param [deltaPositive] - Overrides sign-based badge colour. Use for lower-is-better metrics.
 * @param [deltaUnit] - Suffix appended to the formatted delta (e.g. `"s"` → `+9s`).
 * @param [compareValues] - Enables compare mode with two side-by-side metrics.
 */
export const DialAnalyticsCard: FC<DialAnalyticsCardProps> = ({
  title,
  value,
  description,
  variant = AnalyticsCardVariant.Default,
  error,
  isLoading,
  className,
  delta,
  deltaPositive,
  deltaUnit,
  compareValues,
}) => {
  const styles = variantStyles[variant];
  const isDeltaPositive =
    deltaPositive !== undefined ? deltaPositive : (delta ?? 0) >= 0;
  const deltaLabel =
    delta === undefined
      ? null
      : `${delta >= 0 ? `+${delta}` : String(delta)}${deltaUnit ?? ''}`;

  return (
    <div
      className={mergeClasses(
        'flex flex-col rounded-lg border border-secondary p-4',
        error || isLoading ? 'gap-2' : 'gap-1',
        styles.container,
        className,
      )}
    >
      {delta !== undefined ? (
        <div className="flex items-center gap-2">
          <span className={styles.title}>{title}</span>
          <span
            className={mergeClasses(
              'dial-tiny-semi-text rounded-[120px] border border-transparent px-2',
              isDeltaPositive
                ? 'bg-success text-success'
                : 'bg-error text-error',
            )}
          >
            {deltaLabel}
          </span>
        </div>
      ) : (
        <span className={styles.title}>{title}</span>
      )}

      {error ? (
        <DialAnalyticsErrorTag className="self-start" />
      ) : isLoading ? (
        <DialLoader fullWidth={false} className="self-start" />
      ) : compareValues ? (
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <DialEllipsisTooltip
              text={compareValues[0].title}
              className="dial-tiny-text text-secondary"
            />
            <span className={styles.value}>{compareValues[0].value}</span>
          </div>
          <div className="h-4 w-px flex-shrink-0 bg-controls-disable-accent" />
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <DialEllipsisTooltip
              text={compareValues[1].title}
              className="dial-tiny-text text-secondary"
            />
            <span className={styles.value}>{compareValues[1].value}</span>
          </div>
        </div>
      ) : (
        <span className={styles.value}>{value}</span>
      )}

      {!error &&
        !isLoading &&
        styles.showDescription &&
        description != null &&
        description !== false && (
          <span className="dial-tiny-text text-secondary">{description}</span>
        )}
    </div>
  );
};
