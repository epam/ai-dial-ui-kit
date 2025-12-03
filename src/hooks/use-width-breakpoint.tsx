import { useState, useEffect, useRef } from 'react';

/**
 * A React hook that tracks the width of a DOM element and determines if it is smaller than a specified breakpoint.
 *
 * This hook returns a `ref` to attach to the element you want to observe and a boolean `isSmaller`
 * that becomes `true` when the element's width is less than the given `breakpoint`, and `false` otherwise.
 * The value updates automatically when the element is resized.
 *
 * @param {number} breakpoint - The width in pixels used as the threshold. `isSmaller` is true when the element's width is less than this value.
 * @returns {{ containerRef: React.RefObject<HTMLElement>, isSmaller: boolean }} An object containing the ref to attach to your element and the boolean indicating if it is smaller than the breakpoint.
 *
 * @example
 * const { containerRef, isSmaller } = useWidthBreakpoint(600);
 *
 * return (
 *   <div ref={containerRef}>
 *     {isSmaller ? 'Compact view' : 'Full view'}
 *   </div>
 * );
 */
export function useWidthBreakpoint(breakpoint: number) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isSmaller, setIsSmaller] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setIsSmaller(width < breakpoint);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [breakpoint]);

  return { containerRef, isSmaller };
}
