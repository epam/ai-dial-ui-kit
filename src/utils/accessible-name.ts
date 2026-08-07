import type { ReactNode } from 'react';

/**
 * Picks the first usable accessible name from an ordered list of candidates.
 *
 * Only non-empty strings can serve as an `aria-label`, so any candidate that is
 * a different kind of `ReactNode` (an element, `undefined`, a number) is
 * skipped. Callers pass candidates in priority order, which lets each component
 * declare its own naming precedence.
 *
 * A tooltip is a common last resort: a control whose only label is a tooltip
 * would otherwise be unnamed, because `DialTooltip` puts its `aria-describedby`
 * on a wrapper element rather than on the control itself, and is suppressed on
 * mobile. Pass the tooltip only when nothing else names the control — as an
 * `aria-label` it overrides the element's own content.
 *
 * @param candidates - Naming candidates, highest priority first
 * @returns The first non-empty string candidate, or `undefined` if there is none
 */
export const resolveAccessibleName = (
  ...candidates: ReactNode[]
): string | undefined =>
  candidates.find(
    (candidate): candidate is string =>
      typeof candidate === 'string' && candidate.length > 0,
  );
