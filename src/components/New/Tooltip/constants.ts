/**
 * Tooltip layout and styling constants.
 * Design system 2.0
 */

/** Height of the `FloatingArrow` triangle, in px — its default `height`. */
export const ARROW_HEIGHT = 7;

/** Space left between the arrow tip and the trigger, in px. */
export const ARROW_GAP = 2;

/**
 * Delay before an on-hover tooltip opens, in ms. Long enough that a pointer
 * crossing the trigger on its way somewhere else does not flash a tooltip.
 */
export const HOVER_OPEN_DELAY = 500;

/**
 * The arrow is an SVG outside the tooltip box, so it cannot inherit the box's
 * background. There is no design-token `fill-*` utility, so the token is read
 * directly — keep it in sync with `bg-control-inverted` in `tooltipClassName`.
 */
export const ARROW_FILL = 'var(--bg-control-inverted, #57647A)';

/**
 * Tooltips sit above popups, dropdowns and the calendar (all `z-[53]`), since
 * they can be triggered by a control inside one of them.
 */
export const tooltipClassName =
  'z-[55] max-w-[300px] whitespace-pre-wrap break-words rounded-lg bg-control-inverted px-3 py-2 dial-small-text text-control-inverted';
