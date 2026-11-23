import { useEffect, useRef, useState } from 'react';

/** Show the skeleton only when loading lasts longer than this (ms). */
export const SKELETON_DELAY_MS = 400;
/** Once shown, keep the skeleton at least this long (ms). */
export const SKELETON_MIN_DURATION_MS = 500;

export interface UseSkeletonTimingOptions {
  /** Wait this long (ms) before showing the skeleton. Default `400`, inside the 300–500 ms the design allows. */
  delay?: number;
  /** Keep a shown skeleton at least this long (ms). Default `500`. */
  minDuration?: number;
}

export interface UseSkeletonTimingResult {
  /** Render the skeleton. `false` during the delay and after the content is ready. */
  showSkeleton: boolean;
  /** Render the real content: loading is over and the skeleton is gone. */
  showContent: boolean;
  /**
   * Class for the content wrapper: a 180 ms fade-in, only when a skeleton was
   * shown and the user has not asked for reduced motion. Empty otherwise.
   */
  contentClassName: string;
  /**
   * Mount the skeleton markup. `true` for the whole load — the delay included —
   * and until a shown skeleton has met its minimum display time. Use this, not
   * `showSkeleton`, to render the skeleton in a container whose height depends
   * on its content: during the delay the container would otherwise be empty
   * and collapse to 0 height.
   */
  showPlaceholder: boolean;
  /**
   * Class for the mounted skeleton: `invisible` during the delay (the space is
   * held, nothing is drawn) and empty once the skeleton is shown.
   */
  placeholderClassName: string;
}

/**
 * A React hook that applies the skeleton timing rules to a loading flag.
 *
 * - Loading that ends within `delay` never shows a skeleton, so a fast response
 *   does not flash a placeholder.
 * - A skeleton that was shown stays for at least `minDuration`, so it does not
 *   blink away.
 * - When the content takes over, `contentClassName` crossfades it in over 180 ms.
 *
 * During the delay both `showSkeleton` and `showContent` are `false`. A
 * container sized by its content (a popup, dropdown, card) must not render
 * nothing then — it would be 0 high. Mount the skeleton with `showPlaceholder`
 * and hide it with `placeholderClassName`: it holds the space without drawing.
 * `invisible` hides only the drawing: a `SkeletonShimmer` `label` is a live
 * region and would be announced on every load, including fast ones that never
 * show a skeleton — so pass `label` only when `showSkeleton` is `true`.
 *
 * @param loading - Whether the data is still loading.
 * @param [options] - `delay` and `minDuration` in milliseconds.
 * @returns {UseSkeletonTimingResult} What to render, plus the reveal class.
 *
 * @example
 * const { showPlaceholder, showSkeleton, placeholderClassName, showContent, contentClassName } =
 *   useSkeletonTiming(isLoading);
 * {showPlaceholder && (
 *   <SkeletonShimmer
 *     label={showSkeleton ? 'Loading' : undefined}
 *     className={placeholderClassName}
 *   >…</SkeletonShimmer>
 * )}
 * {showContent && <div className={contentClassName}>{children}</div>}
 */
export const useSkeletonTiming = (
  loading: boolean,
  {
    delay = SKELETON_DELAY_MS,
    minDuration = SKELETON_MIN_DURATION_MS,
  }: UseSkeletonTimingOptions = {},
): UseSkeletonTimingResult => {
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const shownAt = useRef(0);

  useEffect(() => {
    if (loading) {
      if (showSkeleton) return undefined;
      // No skeleton is on screen, so a reveal from an earlier load must not replay.
      setRevealed(false);
      const timer = setTimeout(() => {
        shownAt.current = Date.now();
        setRevealed(false);
        setShowSkeleton(true);
      }, delay);
      return () => clearTimeout(timer);
    }
    if (!showSkeleton) return undefined;
    const remaining = Math.max(0, minDuration - (Date.now() - shownAt.current));
    const timer = setTimeout(() => {
      setShowSkeleton(false);
      setRevealed(true);
    }, remaining);
    return () => clearTimeout(timer);
  }, [loading, showSkeleton, delay, minDuration]);

  const showContent = !loading && !showSkeleton;

  return {
    showSkeleton,
    showContent,
    contentClassName:
      showContent && revealed ? 'motion-safe:animate-skeleton-reveal' : '',
    showPlaceholder: loading || showSkeleton,
    placeholderClassName: showSkeleton ? '' : 'invisible',
  };
};
