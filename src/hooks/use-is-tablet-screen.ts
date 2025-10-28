import { isMediumScreen, isSmallScreen } from '@/utils/mobile';
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
