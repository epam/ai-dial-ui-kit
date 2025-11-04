import type { DateValue } from './DateCellRenderer';

export function convertToDate(input?: DateValue | null): Date | null {
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

    // Treat pure integer strings as epoch milliseconds (supports negatives).
    if (/^-?\d+$/.test(trimmed)) {
      const asNum = Number(trimmed);
      return convertToDate(asNum);
    }

    const d = new Date(trimmed);
    return isFinite(d.getTime()) ? d : null;
  }

  return null;
}
