/**
 * Interactive tooltip layout and styling constants.
 * Design system 2.0
 */

/** Space left between the panel and the trigger, in px. */
export const INTERACTIVE_TOOLTIP_GAP = 8;

/**
 * Delay before an on-hover interactive tooltip opens, in ms. Long enough that
 * a pointer crossing the trigger on its way somewhere else does not flash it.
 */
export const INTERACTIVE_TOOLTIP_HOVER_OPEN_DELAY = 400;

/**
 * The panel sits above the surface it is anchored to — a dropdown or select
 * overlay, both `z-[53]` — since it can be opened from a row inside one of
 * them.
 *
 * By style this is a neutral floating panel rather than the coloured
 * `Notification` banner: it shares the raised-card shape a dropdown or the
 * calendar use (`shadow-md`, `rounded-xl`), on the base `bg-layer-0` surface
 * rather than their raised one — the panel is opened over content, not
 * stacked inside another panel. `contentClassName` can still replace it with
 * any other background: `twMerge` resolves the conflicting `bg-*` utility.
 * Padding and width are the panel's own, sized for a block of copy and
 * controls rather than a menu row.
 */
export const interactiveTooltipClassName =
  'z-[54] max-w-[320px] rounded-xl bg-layer-0 p-4 dial-small-text text-primary shadow-md';
