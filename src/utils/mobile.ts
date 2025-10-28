/**
 * Checks if the current viewport width is within the "medium" (tablet) screen range.
 *
 * Specifically, it returns `true` if the window width is less than 1024 pixels.
 * Safely handles server-side rendering by verifying that `window` is defined.
 *
 * @returns {boolean} `true` if the viewport width is less than 1024px, otherwise `false`.
 *
 * @example
 * if (isMediumScreen()) {
 *   console.log('Tablet or smaller screen detected');
 * }
 */
export const isMediumScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < 1024;

export const isSmallScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < 640;
