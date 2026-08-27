export type DateValue = string | number | Date;

/**
 * Normalises the value a date cell can receive into a `Date`, or `null` when it
 * carries no usable date. A pure integer string is read as epoch milliseconds,
 * so a serialised timestamp behaves like the number it came from.
 */
export const convertToDate = (input?: DateValue | null): Date | null => {
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
      return convertToDate(Number(trimmed));
    }

    const date = new Date(trimmed);
    return isFinite(date.getTime()) ? date : null;
  }

  return null;
};
