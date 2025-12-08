import classNames from 'classnames';
import { useMemo, type FC } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';

import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import {
  dateCellBaseClassName,
  DEFAULT_DATE_FORMAT_OPTIONS,
  DEFAULT_LOCALE,
} from './constants';
import { convertToDate } from './utils';

export type DateValue = string | number | Date;

export interface DialDateCellRendererProps
  extends Partial<ICellRendererParams<Record<string, unknown>, DateValue>> {
  value?: DateValue | null;
  locale?: string;
  options?: Intl.DateTimeFormatOptions;
  emptyPlaceholder?: string;
  className?: string;
}

/**
 * Minimal date cell renderer (ag-Grid compatible).
 *
 * Renders the value in the **"MMM dd, yyyy"** format (e.g., "Jul 20, 2025"),
 * wrapped in `DialEllipsisTooltip` (tooltip only appears if truncated).
 *
 * @example
 * ```tsx
 * // ag-Grid colDef
 * { field: 'createdAt', cellRenderer: DateCellRenderer, cellRendererParams: { options: { timeZone: 'UTC' } } }
 *
 * // Direct usage
 * <DateCellRenderer value="2025-07-20T00:00:00Z" options={{ timeZone: 'UTC' }} />
 * <DateCellRenderer value={1752969600000} options={{ timeZone: 'UTC' }} /> // milliseconds
 * ```
 *
 * @param [locale='en-US'] - Locale fixed to U.S. English by default to enforce "Jul 20, 2025".
 * @param [options={ year: 'numeric', month: 'numeric', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC' }] - Options for date formatting (e.g., timeZone).
 * @param [emptyPlaceholder] - Placeholder when value is empty/invalid.
 * @param [className] - Additional classes merged into the wrapper.
 */
export const DialDateCellRenderer: FC<DialDateCellRendererProps> = ({
  value,
  locale = DEFAULT_LOCALE,
  options = DEFAULT_DATE_FORMAT_OPTIONS,
  emptyPlaceholder,
  className,
}) => {
  const date = convertToDate(value);

  const content = useMemo(() => {
    if (!date) return emptyPlaceholder;

    const formatted = new Intl.DateTimeFormat(locale, options);

    return formatted.format(date);
  }, [date, emptyPlaceholder, locale, options]);

  const iso = date ? date.toISOString() : undefined;

  return (
    <DialEllipsisTooltip
      text={
        iso ? <time dateTime={iso}>{content}</time> : <span>{content}</span>
      }
      className={classNames(dateCellBaseClassName, className)}
      hideTooltip={false}
    />
  );
};
