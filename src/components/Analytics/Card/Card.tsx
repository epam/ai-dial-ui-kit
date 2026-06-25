import type { FC, ReactNode } from 'react';

import { DialAnalyticsErrorTag } from '@/components/Analytics/ErrorTag/ErrorTag';
import { AnalyticsCardVariant } from '@/types/analytics';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialAnalyticsCardProps {
  title: ReactNode;
  value?: ReactNode;
  description?: ReactNode;
  variant?: AnalyticsCardVariant;
  /** Renders an error tag in place of the value when the value is unavailable. */
  error?: boolean;
  className?: string;
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
 *
 * Building block for the analytics component family — composite analytics
 * components (charts, dashboards) can reuse it to present headline figures.
 *
 * Two visual variants are available via the {@link AnalyticsCardVariant} enum:
 * - `Default` — `bg-layer-3`, large `dial-display2-text` value, supports a description.
 * - `Compact` — denser `bg-layer-2` card with a `dial-body-semi-text` value and no
 *   description (the `description` prop is ignored in this variant).
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
 *   title="Active users"
 *   value="3,201"
 *   variant={AnalyticsCardVariant.Compact}
 * />
 * ```
 *
 * @param title - Short label describing the metric, rendered above the value.
 * @param [value] - The primary metric value, displayed prominently. Omit it when `error` is set.
 * @param [description] - Optional supporting text. Accepts a string or any ReactNode.
 *   Ignored when `variant` is `Compact`.
 * @param [variant=AnalyticsCardVariant.Default] - Visual style of the card. Uses the
 *   {@link AnalyticsCardVariant} enum.
 * @param [error] - Renders an error tag in place of the value when the value is unavailable.
 * @param [className] - Additional CSS classes for the card container.
 */
export const DialAnalyticsCard: FC<DialAnalyticsCardProps> = ({
  title,
  value,
  description,
  variant = AnalyticsCardVariant.Default,
  error,
  className,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={mergeClasses(
        'flex flex-col rounded-lg border border-secondary p-4',
        error ? 'gap-2' : 'gap-1',
        styles.container,
        className,
      )}
    >
      <span className={styles.title}>{title}</span>
      {error ? (
        <DialAnalyticsErrorTag className="self-start" />
      ) : (
        <span className={styles.value}>{value}</span>
      )}
      {!error &&
        styles.showDescription &&
        description != null &&
        description !== false && (
          <span className="dial-tiny-text text-secondary">{description}</span>
        )}
    </div>
  );
};
