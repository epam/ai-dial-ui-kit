/**
 * Media query matched only by a device that positively reports it cannot hover
 * its primary pointer — a touch-only phone or tablet.
 *
 * `(hover: none)` is deliberately the whole query. `(pointer: coarse)` would
 * also catch a touchscreen laptop driven by a mouse and a TV remote, both of
 * which hover perfectly well.
 */
export const NO_HOVER_MEDIA_QUERY = '(hover: none)';

/**
 * Reports whether the device says its primary pointer cannot hover.
 *
 * Keyed on input capability rather than viewport width on purpose: an app
 * embedded in a narrow desktop iframe sees a `window.innerWidth` of a few
 * hundred pixels while still being driven by a mouse, so a width test would
 * wrongly strip its hover-only affordances.
 *
 * Returns `false` when there is no `window` (SSR) or no `matchMedia` support,
 * so hover-only UI stays rendered rather than silently disappearing wherever
 * the question cannot be answered.
 *
 * @returns {boolean} `true` only when the device reports `hover: none`.
 *
 * @example
 * if (!hasNoHoverSupport()) {
 *   console.log('The pointer can hover — hover-only affordances are usable');
 * }
 */
export const hasNoHoverSupport = () => {
  if (
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function'
  ) {
    return false;
  }

  return window.matchMedia(NO_HOVER_MEDIA_QUERY).matches;
};
