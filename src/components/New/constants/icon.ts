/**
 * Icon stroke (1.5px) from the 2.0 stroke scale. Tabler renders every outline
 * icon at `stroke={2}` unless told otherwise, so the token has to be passed
 * explicitly — a 2.0 component that omits it draws a heavier icon than the
 * design system asks for.
 *
 * It is a number rather than a Tailwind utility because an icon's weight is an
 * SVG `stroke-width` attribute on the glyph, not a border on its box. The
 * border half of the same scale stays on plain Tailwind widths — `border`,
 * `border-2`, `border-4`, and `border-[0.5px]` for a table divider.
 *
 * Exported publicly so icons a consumer passes into a 2.0 component — a button
 * icon, a menu item, a segmented-control segment — can match the ones the
 * components draw themselves.
 *
 * Two deliberate departures inside the library: the empty-state illustrations
 * (`NoDataContent`, the grid's no-rows overlay) use a much lighter stroke,
 * since a 1.5px line reads as a drawing at 16px and as a fence at 100px; and
 * the checkbox glyph uses a heavier one, because it is a control mark sized to
 * a 14px box rather than an icon from the set.
 */
export const DIAL_KIT_ICON_STROKE = 1.5;
