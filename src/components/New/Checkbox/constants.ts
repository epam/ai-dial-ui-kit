/**
 * The check and minus glyphs are decorative: the input's `checked` and
 * `aria-checked` already carry the state, so the icon is hidden from assistive
 * tech. Tabler renders a bare `<svg>` with no role, so `aria-hidden` is explicit.
 */
export const CHECKBOX_ICON_PROPS = {
  size: 14,
  stroke: 3,
  'aria-hidden': true,
} as const;
