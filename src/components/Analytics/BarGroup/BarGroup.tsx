import type { FC, ReactNode } from 'react';

import { DialAccordion } from '@/components/Accordion/Accordion';
import { DialAnalyticsBar } from '@/components/Analytics/Bar/Bar';
import type { AnalyticsBarColorStop } from '@/models/analytics';

export interface DialAnalyticsBarGroupProps {
  /** Title passed to the accordion header. */
  title: ReactNode;
  /** Map of metric name to numeric value. Each entry renders one bar. */
  data: Record<string, number>;
  /** Upper bound passed to every bar. Defaults to the bar's own default (`1`). */
  maxValue?: number;
  /** Color map passed to every bar. */
  colorMap?: AnalyticsBarColorStop[];
  /** Whether the accordion is expanded initially. Defaults to `true`. */
  defaultExpanded?: boolean;
  /** Additional CSS classes for the accordion container. */
  className?: string;
}

/**
 * A collapsible group of analytics bars built from a key/value map. Wraps
 * {@link DialAccordion}: the `title` is shown in the header, the number of entries
 * is shown as the header description, and each entry renders a {@link DialAnalyticsBar}
 * with the key as its title and the value as its value.
 * aliases: MetricBarGroup|BarList|NumericResults
 *
 * @example
 * ```tsx
 * <DialAnalyticsBarGroup
 *   title="Relevance"
 *   data={{ accuracy: 0.82, recall: 0.64, precision: 0.91 }}
 * />
 * ```
 *
 * @param title - Title passed to the accordion header.
 * @param data - Map of metric name to numeric value. Each entry renders one bar.
 * @param [maxValue] - Upper bound passed to every bar.
 * @param [colorMap] - Color map passed to every bar.
 * @param [defaultExpanded=true] - Whether the accordion is expanded initially.
 * @param [className] - Additional CSS classes for the accordion container.
 */
export const DialAnalyticsBarGroup: FC<DialAnalyticsBarGroupProps> = ({
  title,
  data,
  maxValue,
  colorMap,
  defaultExpanded = true,
  className,
}) => {
  const entries = Object.entries(data);

  return (
    <DialAccordion
      title={title}
      description={`${entries.length} numeric results`}
      defaultExpanded={defaultExpanded}
      className={className}
    >
      <div className="flex flex-col gap-3">
        {entries.map(([key, value]) => (
          <DialAnalyticsBar
            key={key}
            title={key}
            value={value}
            maxValue={maxValue}
            colorMap={colorMap}
          />
        ))}
      </div>
    </DialAccordion>
  );
};
