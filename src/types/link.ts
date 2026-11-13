/**
 * The colour family of a 2.0 `Link`, matching what `ButtonVariant` means for a
 * `Button`. Every value is a combination the design defines, so the API cannot
 * express one that is not drawn.
 */
export enum LinkVariant {
  /** Accent blue, semibold. */
  Primary = 'primary',
  /** Primary text colour, regular weight. */
  Neutral = 'neutral',
  /** For an inverted surface such as a `Tooltip` or `InteractiveTooltip` panel. Semibold. */
  Inverted = 'inverted',
}
