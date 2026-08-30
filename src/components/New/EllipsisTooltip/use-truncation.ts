import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  observeElementSize,
  scheduleMeasure,
} from '@/utils/element-size-observer';

/**
 * Reports whether an element's text is being cut off by `text-overflow`, so a
 * tooltip can carry the full string only when there is something to reveal.
 *
 * Truncation is a layout fact, not a prop: it depends on the width the element
 * ends up with. The measurement therefore re-runs on every text change, on
 * window resize, and — since a parent can resize without the window doing so —
 * whenever the element's own box changes size.
 *
 * All of that goes through the shared observer in
 * `@/utils/element-size-observer`, so a screen full of truncating labels costs
 * one `ResizeObserver`, one resize listener and one animation frame in total
 * rather than a set per label.
 *
 * @param text - The rendered content; a change to it re-measures
 * @returns `ref` to attach to the truncating element, whether it `isTruncated`,
 * its `textContent` (the full string even when `text` is a node), and
 * `remeasure` to force a fresh read before an interaction reads the result
 */
export const useTruncation = <T extends HTMLElement>(text: ReactNode) => {
  const ref = useRef<T | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [textContent, setTextContent] = useState('');

  // A string `text` is already the full string, so the DOM read that recovers
  // it from a node is skipped for what is by far the common case. It lives in a
  // ref because `measure` has to stay referentially stable: the shared observer
  // keys its callbacks by element.
  const isTextNodeRef = useRef(false);

  const measure = useCallback(() => {
    const element = ref.current;

    if (!element) return;

    if (isTextNodeRef.current) {
      setTextContent(element.textContent ?? '');
    }

    // `scrollWidth` against `clientWidth` is the whole check: both are layout
    // widths of the same box, so a wider scroll width is exactly what
    // `text-overflow` clips.
    setIsTruncated(element.scrollWidth > element.clientWidth);
  }, []);

  // Reading layout inside an event handler forces a synchronous reflow, so the
  // measurement is deferred to the next frame — shared with every other
  // pending measurement, which keeps the batch to a single reflow.
  const remeasure = useCallback(() => scheduleMeasure(measure), [measure]);

  // Observing is tied to the element, not to the text: a new string must not
  // cost an unobserve and a re-observe.
  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    return observeElementSize(element, measure);
  }, [measure]);

  useEffect(() => {
    isTextNodeRef.current = typeof text !== 'string';

    remeasure();
  }, [text, remeasure]);

  return { ref, isTruncated, textContent, remeasure };
};
