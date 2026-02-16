import { useState, useEffect, useRef, type RefObject } from 'react';

/**
 * A React hook that tracks the width of a DOM element and determines if it is smaller than a specified breakpoint.
 *
 * This hook returns a `ref` to attach to the element you want to observe and a boolean `isBelowBreakpoint`
 * that becomes `true` when the element's width is less than the given `breakpoint`, and `false` otherwise.
 * The value updates automatically when the element is resized.
 *
 * @param {number} breakpoint - The width in pixels used as the threshold. `isBelowBreakpoint` is true when the element's width is less than this value.
 * @param customBreakpointRef - Custom ref to an element to observe instead of the one returned by this hook. If not provided, the hook will observe the element attached to `containerRef`.
 * @returns {{ containerRef: RefObject<HTMLElement>, isBelowBreakpoint: boolean }} An object containing the ref to attach to your element and the boolean indicating if it is smaller than the breakpoint.
 *
 * @example
 * const { containerRef, isBelowBreakpoint } = useWidthBreakpoint(600);
 *
 * return (
 *   <div ref={containerRef}>
 *     {isBelowBreakpoint ? 'Compact view' : 'Full view'}
 *   </div>
 * );
 */
export function useWidthBreakpoint(
  breakpoint: number,
  customBreakpointRef?: RefObject<HTMLElement | null>,
) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      setIsBelowBreakpoint(width < breakpoint);
    });

    observer.observe(customBreakpointRef?.current || containerRef?.current);
    return () => observer.disconnect();
  }, [breakpoint, customBreakpointRef]);

  return { containerRef, isBelowBreakpoint };
}
