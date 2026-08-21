/** Keys that move the selection inside the group. */
export const NAVIGATION_KEYS = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
];

/** The sunken track the segments sit in. */
export const containerClassName =
  'inline-flex w-fit items-center gap-1 rounded-full bg-layer-sunken p-1';

export const segmentClassName =
  'flex h-8 min-w-8 flex-1 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-4 dial-small-text transition-colors duration-200 outline-offset-0 focus-visible:outline focus-visible:outline-focus';

/** Selected lifts off the track on a raised surface and keeps the accent at rest. */
export const segmentSelectedClassName = 'bg-layer-raised text-accent shadow-xs';

export const segmentUnselectedClassName = 'bg-transparent text-secondary';

/*
 * The hover and active tints are applied only while the segment is enabled: a
 * disabled `<button>` still matches `:hover`, so baking them into the state
 * classes above would tint a disabled segment blue under the pointer.
 */
export const segmentSelectedInteractiveClassName =
  'cursor-pointer hover:bg-control-accent-alpha-hover active:bg-control-accent-alpha-active';

export const segmentUnselectedInteractiveClassName =
  'cursor-pointer hover:bg-control-accent-alpha-hover hover:text-accent active:bg-control-accent-alpha-active';

/**
 * A disabled segment keeps its shape so the group does not reflow, but drops the
 * accent and the shadow.
 */
export const segmentDisabledSelectedClassName =
  'cursor-not-allowed bg-control-disable-primary text-control-disable-primary shadow-none';

export const segmentDisabledUnselectedClassName =
  'cursor-not-allowed bg-transparent text-control-disable-primary';
