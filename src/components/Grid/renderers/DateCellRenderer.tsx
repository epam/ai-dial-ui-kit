import classNames from 'classnames';
import { useMemo, type FC } from 'react';
import type { ICellRendererParams } from 'ag-grid-community';

import { DialEllipsisTooltip } from '@/components/EllipsisTooltip/EllipsisTooltip';
import { dateCellBaseClasses, DEFAULT_LOCALE } from './constants';

type AgGridValue = string | number | Date;

export interface DialDateCellRendererProps
  extends Partial<ICellRendererParams<Record<string, unknown>, AgGridValue>> {
  value?: AgGridValue | null;
  locale?: string;
  timeZone?: string;
  emptyPlaceholder?: string;
  cssClass?: string;
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
 * { field: 'createdAt', cellRenderer: DateCellRenderer, cellRendererParams: { timeZone: 'UTC' } }
 *
 * // Direct usage
 * <DateCellRenderer value="2025-07-20T00:00:00Z" timeZone="UTC" />
 * <DateCellRenderer value={1752969600000} timeZone="UTC" /> // milliseconds
 * ```
 *
 * @param [locale='en-US'] - Locale fixed to U.S. English by default to enforce "Jul 20, 2025".
 * @param [timeZone] - Optional IANA time zone for stable day rendering (e.g., 'UTC').
 * @param [emptyPlaceholder='—'] - Placeholder when value is empty/invalid.
 * @param [cssClass] - Additional classes merged into the wrapper.
 */
export const DialDateCellRenderer: FC<DialDateCellRendererProps> = ({
  value,
  locale = DEFAULT_LOCALE,
  timeZone,
  emptyPlaceholder = '—',
  cssClass,
}) => {
  const date = convertToDate(value);

  const content = useMemo(() => {
    if (!date) return emptyPlaceholder;

    const formatted = new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      ...(timeZone ? { timeZone } : {}),
    });

    return formatted.format(date);
  }, [date, emptyPlaceholder, locale, timeZone]);

  const iso = date ? date.toISOString() : undefined;

  return (
    <DialEllipsisTooltip
      text={
        iso ? <time dateTime={iso}>{content}</time> : <span>{content}</span>
      }
      cssClass={classNames(dateCellBaseClasses, cssClass)}
      hideTooltip={false}
    />
  );
};

function convertToDate(input?: AgGridValue | null): Date | null {
  if (!input) return null;

  if (input instanceof Date) {
    return isFinite(input.getTime()) ? input : null;
  }

  if (typeof input === 'number') {
    const date = new Date(input);
    return isFinite(date.getTime()) ? date : null;
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();

    if (/^-?\d+$/.test(trimmed)) {
      const asNum = Number(trimmed);
      return convertToDate(asNum);
    }

    const d = new Date(trimmed);
    return isFinite(d.getTime()) ? d : null;
  }

  return null;
}
