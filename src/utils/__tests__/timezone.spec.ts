import { afterEach, describe, expect, test, vi } from 'vitest';

import { getTimezoneLabel } from '@/utils/timezone';

/* The label is assembled from what the platform renders, so `Intl` is stubbed
   to a fixed zone/offset pair — deterministic in every environment. The
   `longOffset` rendering itself belongs to the platform, not to this util.
   The stub is a plain constructable function because the util calls
   `new Intl.DateTimeFormat(...)`, and a `vi.fn()` implementation's return
   value is not reliably used as the constructed instance. */
const stubIntlTimezone = (timeZone: string, offsetLabel?: string) => {
  const DateTimeFormatStub = function (
    _locale?: string,
    options?: { timeZoneName?: string },
  ) {
    /* Returns the instance so it works called both plainly (the util's
       zone default `Intl.DateTimeFormat()`) and with `new`. */
    return {
      resolvedOptions: () => ({ timeZone }),
      formatToParts: () =>
        options?.timeZoneName
          ? [{ type: 'timeZoneName', value: offsetLabel }]
          : [],
    };
  } as unknown as typeof Intl.DateTimeFormat;

  vi.stubGlobal('Intl', { DateTimeFormat: DateTimeFormatStub });
};

describe('getTimezoneLabel utility', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  test('wraps the platform offset label with the IANA timezone name', () => {
    stubIntlTimezone('Europe/Berlin', 'GMT+01:00');
    expect(
      getTimezoneLabel({
        timeZone: 'Europe/Berlin',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('(GMT+01:00) Europe/Berlin');
  });

  test('keeps a partial-hour offset label intact', () => {
    stubIntlTimezone('Asia/Kolkata', 'GMT+05:30');
    expect(
      getTimezoneLabel({
        timeZone: 'Asia/Kolkata',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('(GMT+05:30) Asia/Kolkata');
  });

  test('keeps a negative offset label intact', () => {
    stubIntlTimezone('America/New_York', 'GMT-05:00');
    expect(
      getTimezoneLabel({
        timeZone: 'America/New_York',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('(GMT-05:00) America/New_York');
  });

  test('keeps the bare platform form for UTC intact', () => {
    stubIntlTimezone('UTC', 'GMT');
    expect(
      getTimezoneLabel({ timeZone: 'UTC', date: new Date(2026, 0, 15) }),
    ).toBe('(GMT) UTC');
  });

  test('defaults to the viewer zone and today when no options are passed', () => {
    stubIntlTimezone('Europe/Berlin', 'GMT+01:00');
    expect(getTimezoneLabel()).toBe('(GMT+01:00) Europe/Berlin');
  });

  test('falls back to the bare zone name when the platform yields no offset', () => {
    stubIntlTimezone('Europe/Berlin');
    expect(
      getTimezoneLabel({
        timeZone: 'Europe/Berlin',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('Europe/Berlin');
  });

  test('falls back to the bare zone name when longOffset is unsupported', () => {
    /* A plain function that throws, per the stubbing note above — engines
       without `longOffset` reject the option at construction. */
    const ThrowingDateTimeFormat = function () {
      throw new RangeError('Value longOffset out of range');
    } as unknown as typeof Intl.DateTimeFormat;

    vi.stubGlobal('Intl', { DateTimeFormat: ThrowingDateTimeFormat });
    expect(
      getTimezoneLabel({
        timeZone: 'Europe/Berlin',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('Europe/Berlin');
  });

  /* The stub keys its offset label on the locale it was constructed with, so
     the two tests below pin how the `locale` option reaches `Intl`. */
  const stubLocaleAwareIntl = () => {
    vi.stubGlobal('Intl', {
      DateTimeFormat: function (
        locale?: string,
        options?: { timeZoneName?: string },
      ) {
        return {
          resolvedOptions: () => ({ timeZone: 'Europe/Berlin' }),
          formatToParts: () =>
            options?.timeZoneName
              ? [
                  {
                    type: 'timeZoneName',
                    value: locale === 'fr' ? 'UTC+01:00' : 'GMT+01:00',
                  },
                ]
              : [],
        };
      } as unknown as typeof Intl.DateTimeFormat,
    });
  };

  test('renders the offset in the requested locale', () => {
    stubLocaleAwareIntl();
    expect(
      getTimezoneLabel({
        locale: 'fr',
        timeZone: 'Europe/Berlin',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('(UTC+01:00) Europe/Berlin');
  });

  test('omitting locale passes undefined to Intl — the runtime default', () => {
    stubLocaleAwareIntl();
    expect(
      getTimezoneLabel({
        timeZone: 'Europe/Berlin',
        date: new Date(2026, 0, 15),
      }),
    ).toBe('(GMT+01:00) Europe/Berlin');
  });
});
