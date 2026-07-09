import type { FC, ReactNode } from 'react';

import { DialAccordion } from '@/components/Accordion/Accordion';
import { DialAnalyticsBar } from '@/components/Analytics/Bar/Bar';
import { DialLoader } from '@/components/Loader/Loader';
import type { AnalyticsBarColorStop } from '@/models/analytics';
import { mergeClasses } from '@/utils/merge-classes';

export interface DialAnalyticsBarGroupProps {
  /** Title passed to the accordion header. */
  title: ReactNode;
  /** Description passed to the accordion header. Defaults to the number of entries. */
  description?: ReactNode;
  /** Map of metric name to numeric value. Each entry renders one bar. */
  data: Record<string, number>;
  /** Upper bound passed to every bar. Defaults to the bar's own default (`1`). */
  maxValue?: number;
  /** Color map passed to every bar. */
  colorMap?: AnalyticsBarColorStop[];
  /** Whether the accordion is expanded initially. Defaults to `true`. */
  defaultExpanded?: boolean;
  /**
   * Renders the group permanently expanded: the content is always visible and
   * the accordion header has no toggle or chevron icon.
   */
  nonCollapsible?: boolean;
  /** Renders a loader in place of the bars while the data is being fetched. */
  isLoading?: boolean;
  /** Invoked with the entry key and value when a bar is clicked. When set, each bar becomes an interactive button. */
  onBarClick?: (key: string, value: number) => void;
  /** Renders every bar on a single row (50% title, 50% bar + value). */
  inline?: boolean;
  /** Additional CSS classes for each bar's title label. */
  barTitleClassName?: string;
  /** Additional CSS classes for each bar's value label. */
  barValueClassName?: string;
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
 * @param [description] - Description passed to the accordion header. Defaults to the number of entries.
 * @param data - Map of metric name to numeric value. Each entry renders one bar.
 * @param [maxValue] - Upper bound passed to every bar.
 * @param [colorMap] - Color map passed to every bar.
 * @param [defaultExpanded=true] - Whether the accordion is expanded initially.
 * @param [nonCollapsible] - Renders the group permanently expanded without a toggle or chevron.
 * @param [isLoading] - Renders a loader in place of the bars while the data is being fetched.
 * @param [onBarClick] - Invoked with the entry key and value when a bar is clicked.
 * @param [inline] - Renders every bar on a single row (50% title, 50% bar + value).
 * @param [barTitleClassName] - Additional CSS classes for each bar's title label.
 * @param [barValueClassName] - Additional CSS classes for each bar's value label.
 * @param [className] - Additional CSS classes for the accordion container.
 */
export const DialAnalyticsBarGroup: FC<DialAnalyticsBarGroupProps> = ({
  title,
  description,
  data,
  maxValue,
  colorMap,
  defaultExpanded = true,
  nonCollapsible,
  isLoading,
  onBarClick,
  inline,
  barTitleClassName,
  barValueClassName,
  className,
}) => {
  const entries = Object.entries(data);

  return (
    <DialAccordion
      title={title}
      description={description}
      defaultExpanded={defaultExpanded}
      nonCollapsible={nonCollapsible}
      className={className}
    >
      <div
        className={mergeClasses('flex flex-col', inline ? 'gap-2' : 'gap-3')}
      >
        {isLoading ? (
          <DialLoader fullWidth={false} className="self-center" />
        ) : (
          entries.map(([key, value]) =>
            onBarClick ? (
              <button
                key={key}
                type="button"
                onClick={() => onBarClick(key, value)}
                className="cursor-pointer rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
              >
                <DialAnalyticsBar
                  title={key}
                  value={value}
                  maxValue={maxValue}
                  colorMap={colorMap}
                  inline={inline}
                  titleClassName={barTitleClassName}
                  valueClassName={barValueClassName}
                />
              </button>
            ) : (
              <DialAnalyticsBar
                key={key}
                title={key}
                value={value}
                maxValue={maxValue}
                colorMap={colorMap}
                inline={inline}
                titleClassName={barTitleClassName}
                valueClassName={barValueClassName}
              />
            ),
          )
        )}
      </div>
    </DialAccordion>
  );
};
