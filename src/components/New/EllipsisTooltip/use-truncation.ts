import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

/**
 * Reports whether an element's text is being cut off by `text-overflow`, so a
 * tooltip can carry the full string only when there is something to reveal.
 *
 * Truncation is a layout fact, not a prop: it depends on the width the element
 * ends up with. The measurement therefore re-runs on every text change, on
 * window resize, and — since a parent can resize without the window doing so —
 * whenever the element's own box changes size.
 *
 * @param text - The rendered content; a change to it re-measures
 * @returns `ref` to attach to the truncating element, whether it `isTruncated`,
 * its `textContent` (the full string even when `text` is a node), and
 * `remeasure` to force a fresh read before an interaction reads the result
 */
export const useTruncation = <T extends HTMLElement>(text: ReactNode) => {
  const ref = useRef<T | null>(null);
  const frameRef = useRef<number | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [textContent, setTextContent] = useState('');

  const measure = useCallback(() => {
    const element = ref.current;

    if (!element) return;

    setTextContent(element.textContent ?? '');

    // `scrollWidth` is rounded, so a sub-pixel box can report one pixel more
    // than `clientWidth` while nothing is actually clipped. Comparing against
    // the ceiled rendered width as well keeps that from reading as truncation.
    const renderedWidth = Math.ceil(element.getBoundingClientRect().width);

    setIsTruncated(
      element.scrollWidth > element.clientWidth ||
        element.scrollWidth > renderedWidth,
    );
  }, []);

  // Reading layout inside an event handler forces a synchronous reflow, so the
  // measurement is deferred to the next frame.
  const remeasure = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(measure);
  }, [measure]);

  useEffect(() => {
    remeasure();

    window.addEventListener('resize', remeasure);

    let observer: ResizeObserver | null = null;

    if ('ResizeObserver' in window && ref.current) {
      observer = new ResizeObserver(remeasure);
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener('resize', remeasure);
      observer?.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, remeasure]);

  return { ref, isTruncated, textContent, remeasure };
};
