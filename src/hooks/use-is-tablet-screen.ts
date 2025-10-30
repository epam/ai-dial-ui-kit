import { getScreenType, isMediumScreen, isSmallScreen } from '@/utils/mobile';
import { useEffect, useState } from 'react';

/**
 * A React hook that determines whether the current window size matches a tablet screen width.
 *
 * It initializes based on the current screen size using `isMediumScreen()` and updates its value
 * whenever the window is resized.
 *
 * @returns {boolean} `true` if the viewport width matches the tablet breakpoint, otherwise `false`.
 *
 * @example
 * const isTablet = useIsTabletScreen();
 * if (isTablet) {
 *   console.log('Tablet layout active');
 * }
 */
export const useIsTabletScreen = () => {
  const [isTabletScreen, setIsTabletScreen] = useState(isMediumScreen());

  useEffect(() => {
    const resizeListener = () => setIsTabletScreen(isMediumScreen());
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return isTabletScreen;
};

/**
 * A React hook that determines whether the current window size matches a mobile screen width.
 *
 * It initializes based on the current screen size using `isSmallScreen()` and updates its value
 * whenever the window is resized.
 *
 * @returns {boolean} `true` if the viewport width matches the mobile breakpoint, otherwise `false`.
 *
 * @example
 * const isMobile = useIsMobileScreen();
 * if (isMobile) {
 *   console.log('Mobile layout active');
 * }
 */
export const useIsMobileScreen = () => {
  const [isMobileScreen, setIsMobileScreen] = useState(isSmallScreen());

  useEffect(() => {
    const resizeListener = () => setIsMobileScreen(isSmallScreen());
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return isMobileScreen;
};

/**
 * A React hook that determines the current screen type based on the viewport width.
 *
 * It uses `getScreenType()` to categorize the screen as `Desktop`, `Tablet`, or `Mobile`,
 * and automatically updates the value when the window is resized.
 *
 * This hook is useful for implementing responsive layouts that adapt
 * their UI or behavior depending on screen type.
 *
 * @returns {ScreenType} The current screen type (`Desktop`, `Tablet`, `Mobile`, or `Undefined` for SSR).
 *
 * @example
 * const screenType = useScreenType();
 *
 * if (screenType === ScreenType.Desktop) {
 *   console.log('Desktop layout active');
 * }
 */
export const useScreenType = () => {
  const [type, setType] = useState(getScreenType());

  useEffect(() => {
    const resizeListener = () => setType(getScreenType());
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return type;
};
