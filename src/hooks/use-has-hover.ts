import { useEffect, useState } from 'react';

import { hasNoHoverSupport, NO_HOVER_MEDIA_QUERY } from '@/utils/pointer';

/**
 * A React hook that reports whether the device's primary pointer can hover.
 *
 * Tracks the `hover: none` media query rather than the viewport width, so a
 * narrow embed on a desktop still counts as hover-capable, and re-evaluates
 * when a hybrid device switches input — a tablet that gains a trackpad starts
 * hovering without a reload.
 *
 * Defaults to `true` where the capability cannot be read (SSR, or a browser
 * without `matchMedia`), so hover-only UI is never dropped on a guess.
 *
 * @returns {boolean} `true` when the pointer can hover, `false` on a touch-only device.
 *
 * @example
 * const hasHover = useHasHover();
 * if (!hasHover) {
 *   return null; // Nothing would ever reveal a hover-only bubble here
 * }
 */
export const useHasHover = () => {
  const [hasHover, setHasHover] = useState(() => !hasNoHoverSupport());

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function'
    ) {
      return;
    }

    const mediaQueryList = window.matchMedia(NO_HOVER_MEDIA_QUERY);
    setHasHover(!mediaQueryList.matches);

    /* Safari below 14 exposes only the deprecated `addListener` pair. */
    if (typeof mediaQueryList.addEventListener !== 'function') {
      return;
    }

    const changeListener = (event: MediaQueryListEvent) =>
      setHasHover(!event.matches);
    mediaQueryList.addEventListener('change', changeListener);
    return () => mediaQueryList.removeEventListener('change', changeListener);
  }, []);

  return hasHover;
};
