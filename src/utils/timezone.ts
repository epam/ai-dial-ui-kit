/**
 * Options for {@link getTimezoneLabel}.
 */
export interface TimezoneLabelOptions {
  /** BCP 47 locale tag; only affects how the platform renders the offset
   * (e.g. `fr` renders `UTC+01:00` where `en` renders `GMT+01:00`). Omitting
   * it passes `undefined` to `Intl`, which resolves to the runtime's default
   * locale. */
  locale?: string;
  /** IANA timezone name; defaults to the viewer's zone from
   * `Intl.DateTimeFormat().resolvedOptions().timeZone`. */
  timeZone?: string;
  /** The date whose offset is rendered — the one in effect on `date`, so a
   * value across a DST boundary from today shows its own offset. Defaults to
   * today. */
  date?: Date;
}

/**
 * Returns a timezone as a hint label for time-of-day fields, e.g.
 * `(GMT+01:00) Europe/Berlin`: the UTC offset in effect at `options.date`
 * rendered by `Intl` (`timeZoneName: 'longOffset'`), followed by the IANA
 * timezone name.
 */
export const getTimezoneLabel = ({
  locale,
  timeZone,
  date = new Date(),
}: TimezoneLabelOptions = {}): string => {
  const zone = timeZone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;

  try {
    const offsetLabel = new Intl.DateTimeFormat(locale, {
      timeZone: zone,
      timeZoneName: 'longOffset',
    })
      .formatToParts(date)
      .find((part) => part.type === 'timeZoneName')?.value;

    return offsetLabel ? `(${offsetLabel}) ${zone}` : zone;
  } catch {
    /* Engines without `longOffset` support reject the option at construction;
     * the zone name alone still tells the user which timezone is meant. */
    return zone;
  }
};
