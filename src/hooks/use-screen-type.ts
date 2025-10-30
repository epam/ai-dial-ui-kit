import { getScreenType } from '@/utils/mobile';
import { useEffect, useState } from 'react';

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
