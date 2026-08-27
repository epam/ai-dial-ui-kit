import type { ICellRendererParams } from 'ag-grid-community';
import { useMemo, type FC } from 'react';

import { convertToDate, type DateValue } from '@/utils/grid-date';
import { mergeClasses } from '@/utils/merge-classes';
import { EllipsisTooltip } from '../../EllipsisTooltip/EllipsisTooltip';
import { DEFAULT_DATE_FORMAT_OPTIONS, DEFAULT_LOCALE } from './constants';

export type { DateValue };

export interface DateCellRendererProps extends Partial<
  ICellRendererParams<Record<string, unknown>, DateValue>
> {
  /** The date to render. A pure integer string is read as epoch milliseconds. */
  value?: DateValue | null;
  /** Locale used for formatting. Defaults to `'en-US'`. */
  locale?: string;
  /** `Intl.DateTimeFormat` options. */
  options?: Intl.DateTimeFormatOptions;
  /** Rendered when the value carries no usable date. */
  emptyPlaceholder?: string;
  /** Additional CSS classes for the cell. */
  className?: string;
  /** Suppresses the truncation tooltip. */
  hideTooltip?: boolean;
}

/**
 * Date cell for the 2.0 {@link Grid}, usable as an ag-Grid `cellRenderer`.
 * aliases: DateCell|TimestampCell
 * Design system 2.0
 *
 * Formats the value with `Intl.DateTimeFormat` and wraps it in a
 * {@link EllipsisTooltip}, so the full string is only offered when the column is
 * too narrow to show it. A valid date is rendered inside a `<time datetime>`,
 * which gives assistive tech and crawlers the machine-readable value next to
 * the localised one.
 *
 * @example
 * ```tsx
 * // As a column renderer
 * { field: 'createdAt', cellRenderer: DateCellRenderer,
 *   cellRendererParams: { options: { timeZone: 'UTC' } } }
 *
 * // Directly
 * <DateCellRenderer value="2025-07-20T00:00:00Z" options={{ timeZone: 'UTC' }} />
 * <DateCellRenderer value={1752969600000} /> // epoch milliseconds
 * ```
 *
 * @param [value] - The date to render.
 * @param [locale='en-US'] - Locale used for formatting.
 * @param [options] - `Intl.DateTimeFormat` options, e.g. `timeZone`.
 * @param [emptyPlaceholder] - Rendered when the value carries no usable date.
 * @param [className] - Additional CSS classes for the cell.
 * @param [hideTooltip=false] - Suppresses the truncation tooltip.
 */
export const DateCellRenderer: FC<DateCellRendererProps> = ({
  value,
  locale = DEFAULT_LOCALE,
  options = DEFAULT_DATE_FORMAT_OPTIONS,
  emptyPlaceholder,
  className,
  hideTooltip = false,
}) => {
  const date = convertToDate(value);

  const content = useMemo(() => {
    if (!date) return emptyPlaceholder;

    return new Intl.DateTimeFormat(locale, options).format(date);
  }, [date, emptyPlaceholder, locale, options]);

  const iso = date ? date.toISOString() : undefined;

  return (
    <EllipsisTooltip
      text={
        iso ? <time dateTime={iso}>{content}</time> : <span>{content}</span>
      }
      className={mergeClasses('dial-small-text text-primary', className)}
      hideTooltip={hideTooltip}
    />
  );
};
