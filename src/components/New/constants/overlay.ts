import classNames from 'classnames';

/**
 * Styling shared by the 2.0 floating surfaces — the dropdown menu and the select
 * option list. They are the same object visually, so they read from one place
 * rather than each keeping its own copy of the tokens.
 */

/** The floating panel itself: rounded raised card with a one-unit inset. */
export const overlaySurfaceClassName =
  'rounded-xl bg-layer-raised p-1 shadow-md';

/**
 * A selectable row inside the panel. Keeps a visible focus ring: these rows are
 * reached by keyboard, and the 1.0 versions suppressed the ring outright.
 */
export const overlayItemClassName = classNames(
  'flex w-full cursor-pointer items-center gap-2 px-3 h-[40px] rounded-lg',
  'dial-small-text text-primary truncate',
  'hover:bg-accent-primary-alpha',
  'focus-visible:outline focus-visible:outline-focus-black',
);

/** Tint marking the row that is currently selected. */
export const overlayItemSelectedClassName = 'bg-accent-primary-alpha';

export const overlayItemDisabledClassName = 'opacity-75';

/** Distance between the trigger and its panel, and between nested panels. */
export const overlayGap = 4;
