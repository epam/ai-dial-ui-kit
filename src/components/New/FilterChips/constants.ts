/**
 * The chip row itself. It does not wrap by default: a filter row is usually one
 * line of a narrow panel, and a caller that wants it to wrap passes
 * `flex-wrap` through `className`.
 */
export const containerClassName = 'flex flex-nowrap items-center gap-1';

/**
 * `stretch` layout: the chips share the row width equally but never shrink
 * below their label, so a row too narrow for all of them overflows rather than
 * truncating every chip. `Tag` is already `rounded-full` and `inline-flex`, so
 * only the growth and the centring are added here.
 */
export const chipStretchClassName = 'min-w-max flex-1 justify-center';
