import { ScreenType } from '@/types/screen';

/**
 * Checks if the current viewport width is within the "medium" (tablet) screen range.
 *
 * Specifically, it returns `true` if the window width is less than 1280 pixels.
 * Safely handles server-side rendering by verifying that `window` is defined.
 *
 * @returns {boolean} `true` if the viewport width is less than 1279px, otherwise `false`.
 *
 * @example
 * if (isMediumScreen()) {
 *   console.log('Tablet or smaller screen detected');
 * }
 */
export const isMediumScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < 1279;

/**
 * Checks if the current viewport width is within the "small" (mobile) screen range.
 *
 * Specifically, it returns `true` if the window width is less than 640 pixels.
 * Safely handles server-side rendering by verifying that `window` is defined.
 *
 * @returns {boolean} `true` if the viewport width is less than 640px, otherwise `false`.
 *
 * @example
 * if (isSmallScreen()) {
 *   console.log('Mobile screen detected');
 * }
 */
export const isSmallScreen = () =>
  typeof window !== 'undefined' && window.innerWidth < 640;

/**
 * Determines the current screen type based on the viewport width.
 *
 * Categorizes the screen into one of three types defined by `ScreenType`:
 * - `ScreenType.Desktop` for widths **≥ 1024px**
 * - `ScreenType.Tablet` for widths **between 640px and 1023px**
 * - `ScreenType.Mobile` for widths **< 640px**
 *
 * If executed in a non-browser environment (where `window` is undefined),
 * it returns `ScreenType.Undefined`.
 *
 * @returns {ScreenType} The detected screen type (`Desktop`, `Tablet`, `Mobile`, or `Undefined`).
 *
 * @example
 * const screenType = getScreenType();
 * if (screenType === ScreenType.Mobile) {
 *   console.log('Mobile layout activated');
 * }
 */
export const getScreenType = (): ScreenType => {
  if (typeof window === 'undefined') return ScreenType.Undefined;

  const width = window.innerWidth;
  if (width >= 1024) return ScreenType.Desktop;
  if (width < 640) return ScreenType.Mobile;
  return ScreenType.Tablet;
};
