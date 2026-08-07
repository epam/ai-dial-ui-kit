export const getMonthGrid = (year: number, month: number): Date[] => {
  const firstOfMonth = new Date(year, month, 1);
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
  const start = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
};

export const isSameDay = (a?: Date | null, b?: Date | null): boolean =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const isDateOutOfRange = (
  date: Date,
  minDate?: Date,
  maxDate?: Date,
): boolean => {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (minDate) {
    const min = new Date(
      minDate.getFullYear(),
      minDate.getMonth(),
      minDate.getDate(),
    );
    if (day < min) return true;
  }
  if (maxDate) {
    const max = new Date(
      maxDate.getFullYear(),
      maxDate.getMonth(),
      maxDate.getDate(),
    );
    if (day > max) return true;
  }
  return false;
};

export const formatMonthLabel = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, { month: 'long', year: 'numeric' });

export const formatDateLabel = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

/**
 * Full label for a day cell in the month grid, e.g. `"Wednesday 11 March 2026"`.
 *
 * A day button renders only its number, so on its own it announces as "15" with
 * no month, year, or weekday context — and a cell spilling over from an
 * adjacent month is indistinguishable from one in the visible month. The
 * weekday and long month also keep this distinct from `formatDateLabel`, which
 * names the trigger.
 */
export const formatDayAriaLabel = (date: Date, locale: string): string =>
  date.toLocaleDateString(locale, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const formatTimeLabel = (date: Date): string =>
  `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;

export const setTimeOnDate = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const next = new Date(date);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return next;
};

export const isCompleteTimeString = (value: string): boolean =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(value);

/** Formats free-typed digits into an `"HH:mm"` mask, clamping each completed segment. */
export const sanitizeTimeInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  let hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);

  if (hours.length === 2) {
    hours = String(Math.min(Number(hours), 23)).padStart(2, '0');
  }

  if (minutes.length === 0) return hours;

  const clampedMinutes = String(Math.min(Number(minutes), 59)).padStart(
    minutes.length,
    '0',
  );
  return `${hours}:${clampedMinutes}`;
};

/** Jan 5th 1970 (UTC) was a Monday — used as a locale-agnostic anchor week. */
const ANCHOR_MONDAY_UTC_DAY = 5;

const capitalize = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const getWeekdayShortLabels = (locale: string): string[] =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(1970, 0, ANCHOR_MONDAY_UTC_DAY + i));
    return capitalize(
      date.toLocaleDateString(locale, { weekday: 'short', timeZone: 'UTC' }),
    );
  });

export const getWeekdayOptions = (
  locale: string,
): { value: string; label: string }[] =>
  Array.from({ length: 7 }, (_, i) => {
    const date = new Date(Date.UTC(1970, 0, ANCHOR_MONDAY_UTC_DAY + i));
    return {
      value: String(i + 1), // ISO weekday: 1 = Monday, 7 = Sunday
      label: capitalize(
        date.toLocaleDateString(locale, { weekday: 'long', timeZone: 'UTC' }),
      ),
    };
  });
