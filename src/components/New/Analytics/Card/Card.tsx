import type { FC, ReactNode } from 'react';

import { DIAL_KIT_CLASS } from '@/constants/public-class-names';
import { Badge } from '@/components/New/Badge/Badge';
import { BadgeColor, BadgeVariant } from '@/types/badge';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import { Spinner } from '@/components/Spinner/Spinner';
import type { AnalyticsCardCompareItem } from '@/models/analytics';
import { AnalyticsCardVariant } from '@/types/analytics';
import { mergeClasses } from '@/utils/merge-classes';

export interface AnalyticsCardProps {
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
    /**
     * Height of the compare divider's cell — the line height of the variant's
     * value type scale, so the divider is centred on the first line of the values.
     */
    compareDividerCell: string;
    showDescription: boolean;
  }
> = {
  [AnalyticsCardVariant.Default]: {
    container: 'bg-layer-3',
    title: 'dial-small-text text-secondary',
    value: 'dial-display2-text text-primary',
    compareDividerCell: 'h-10',
    showDescription: true,
  },
  [AnalyticsCardVariant.Compact]: {
    container: 'bg-layer-2',
    title: 'dial-tiny-text text-secondary',
    value: 'dial-body-semi-text text-primary',
    compareDividerCell: 'h-6',
    showDescription: false,
  },
};

/**
 * A simple analytics summary card that displays a single metric as a title,
 * a prominent value, and an optional description.
 * aliases: MetricCard|StatCard|KpiCard
 * Design system 2.0
 *
 * Two visual variants are available via the {@link AnalyticsCardVariant} enum:
 * - `Default` — `bg-layer-3`, large `dial-display2-text` value, supports a description.
 * - `Compact` — denser `bg-layer-2` card with a `dial-body-semi-text` value and no
 *   description (the `description` prop is ignored in this variant).
 *
 * **Compare mode** — pass `compareValues` to split the value area 50/50 between two
 * metrics, each with its own sub-title. Long sub-titles truncate to a single line and
 * show the full text in a tooltip. Pair with `delta` to show a change badge next
 * to the card title, and `deltaUnit` for a suffix such as `"s"`. The divider is
 * centred on the first line of the two values, so dividers line up across cards
 * whose values differ in height.
 *
 * **Description placement** — when the card is stretched to the height of its row
 * (a grid or flex row with equal-height items), the description sits at the
 * bottom of the card with the free space between it and the value.
 *
 * @example
 * ```tsx
 * <AnalyticsCard
 *   title="Total requests"
 *   value="12,480"
 *   description="+12% vs last week"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AnalyticsCard
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
export const AnalyticsCard: FC<AnalyticsCardProps> = ({
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
        DIAL_KIT_CLASS.analyticsCard,
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
        <Badge
          label="Error"
          variant={BadgeVariant.Filled}
          color={BadgeColor.Red}
          textClassName="dial-tiny-semi-text"
          className="self-start"
        />
      ) : isLoading ? (
        <Spinner size={18} fullWidth={false} className="self-start" />
      ) : compareValues ? (
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-3 gap-y-0.5">
          <EllipsisTooltip
            text={compareValues[0].title}
            className="col-start-1 dial-tiny-text text-secondary"
          />
          <EllipsisTooltip
            text={compareValues[1].title}
            className="col-start-3 dial-tiny-text text-secondary"
          />
          <span className={mergeClasses('col-start-1 min-w-0', styles.value)}>
            {compareValues[0].value}
          </span>
          <div
            aria-hidden="true"
            className={mergeClasses(
              'col-start-2 flex items-center self-start',
              styles.compareDividerCell,
            )}
          >
            <div className="h-4 w-px bg-controls-disable-accent" />
          </div>
          <span className={mergeClasses('col-start-3 min-w-0', styles.value)}>
            {compareValues[1].value}
          </span>
        </div>
      ) : (
        <span className={styles.value}>{value}</span>
      )}

      {!error &&
        !isLoading &&
        styles.showDescription &&
        description != null &&
        description !== false && (
          <span className="mt-auto dial-tiny-text text-secondary">
            {description}
          </span>
        )}
    </div>
  );
};
