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
  /**
   * When provided, enables compare mode: each entry renders a delta badge (computed
   * as `data[key] - compareData[key]`) and two bars — one for `data` and one for
   * `compareData`. `onBarClick` is ignored in compare mode.
   */
  compareData?: Record<string, number>;
  /**
   * Labels shown next to each of the two bars in compare mode.
   * The first label is for `data`, the second for `compareData`.
   * Has no effect when `compareData` is not set.
   */
  compareLabels?: [ReactNode, ReactNode];
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
 * @param [compareData] - Enables compare mode: each entry shows a delta badge and two bars.
 * @param [compareLabels] - Labels for the two bars in compare mode: first for `data`, second for `compareData`.
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
  compareData,
  compareLabels,
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
  const effectiveTitleClass = inline
    ? mergeClasses('text-secondary', barTitleClassName)
    : barTitleClassName;
  const compareLabelClass = compareLabels
    ? 'dial-tiny-text text-secondary'
    : undefined;

  return (
    <DialAccordion
      title={title}
      description={description}
      defaultExpanded={defaultExpanded}
      nonCollapsible={nonCollapsible}
      className={className}
    >
      <div
        className={mergeClasses(
          'flex flex-col',
          compareData ? 'gap-4' : inline ? 'gap-2' : 'gap-3',
        )}
      >
        {isLoading ? (
          <DialLoader fullWidth={false} className="self-center" />
        ) : compareData ? (
          entries.map(([key, value]) => {
            if (!(key in compareData)) return null;
            const compareValue = compareData[key];
            const delta = parseFloat((value - compareValue).toFixed(2));
            const isPositive = delta >= 0;
            const deltaLabel = isPositive ? `+${delta}` : String(delta);
            return (
              <div key={key} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="dial-small-text text-primary">{key}</span>
                  <span
                    className={mergeClasses(
                      'dial-tiny-semi-text rounded-[120px] border border-transparent px-2',
                      isPositive
                        ? 'bg-success text-success'
                        : 'bg-error text-error',
                    )}
                  >
                    {deltaLabel}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 pl-2">
                  <DialAnalyticsBar
                    title={compareLabels?.[0]}
                    value={value}
                    maxValue={maxValue}
                    colorMap={colorMap}
                    inline={inline}
                    titleClassName={compareLabelClass}
                    ariaLabel={key}
                  />
                  <DialAnalyticsBar
                    title={compareLabels?.[1]}
                    value={compareValue}
                    maxValue={maxValue}
                    colorMap={colorMap}
                    inline={inline}
                    titleClassName={compareLabelClass}
                    ariaLabel={`${key} compare`}
                  />
                </div>
              </div>
            );
          })
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
                  titleClassName={effectiveTitleClass}
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
                titleClassName={effectiveTitleClass}
                valueClassName={barValueClassName}
              />
            ),
          )
        )}
      </div>
    </DialAccordion>
  );
};
