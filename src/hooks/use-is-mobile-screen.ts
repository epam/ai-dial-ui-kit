import { isSmallScreen } from '@/utils/mobile';
import { useEffect, useState } from 'react';

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
