import { isMediumScreen } from '@/utils/mobile';
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
