import { IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { BreadcrumbsSize } from '@/types/breadcrumbs';

/**
 * The `<nav>`. It clips rather than wraps: a breadcrumb that reflows onto a
 * second line moves the content below it, so the trail truncates its segments
 * instead (see `segmentWidthClassName`). The tiny trail does not clip at all,
 * so a segment's focus ring stays whole; its segments truncate on their own.
 */
export const navClassName: Record<BreadcrumbsSize, string> = {
  [BreadcrumbsSize.Small]: 'w-full overflow-hidden',
  [BreadcrumbsSize.Tiny]: 'w-full',
  [BreadcrumbsSize.Heading]: 'w-full overflow-hidden',
};

/** The `<ol>` holding the segments and their separators. */
export const listClassName =
  'flex min-w-0 flex-nowrap items-center gap-2 whitespace-nowrap';

/** One `<li>`: the segment and the separator that follows it. */
export const itemClassName = 'flex min-w-0 items-center gap-2';

/**
 * The trail's type scale. It sits on the `<li>`, so the segment, the
 * separator and the tooltip trigger inside it all read from one declaration.
 */
export const sizeClassName: Record<BreadcrumbsSize, string> = {
  [BreadcrumbsSize.Small]: 'dial-small-text',
  [BreadcrumbsSize.Tiny]: 'dial-tiny-text',
  [BreadcrumbsSize.Heading]: 'dial-h2-text',
};

/**
 * The current page is always semibold. `dial-h2-text` already is, so the
 * heading trail repeats its own token rather than reaching for a semibold
 * variant that does not exist.
 */
export const currentSizeClassName: Record<BreadcrumbsSize, string> = {
  [BreadcrumbsSize.Small]: 'dial-small-semi-text',
  [BreadcrumbsSize.Tiny]: 'dial-tiny-semi-text',
  [BreadcrumbsSize.Heading]: 'dial-h2-text',
};

type SegmentPosition = 'first' | 'middle' | 'last';

/**
 * How each segment gives up width when the trail does not fit. The root keeps
 * its full label — it is the anchor the user navigates back to — the middle
 * segments truncate first, and the current page keeps the largest share of
 * what is left, since it names where the user actually is.
 */
const cappedSegmentWidthClassName: Record<SegmentPosition, string> = {
  first: 'shrink-0',
  middle: 'min-w-0 max-w-[30%] shrink',
  last: 'min-w-0 max-w-[51%] shrink',
};

/**
 * The tiny trail caps nothing, so a trail that fits is never truncated. Its
 * middle segments shrink a thousand times faster than the current page, down
 * to a letter and their chevron; only then does the current page give way.
 */
export const segmentWidthClassName: Record<
  BreadcrumbsSize,
  Record<SegmentPosition, string>
> = {
  [BreadcrumbsSize.Small]: cappedSegmentWidthClassName,
  [BreadcrumbsSize.Tiny]: {
    first: 'shrink-0',
    middle: 'min-w-12 shrink-[1000]',
    last: 'min-w-0 shrink',
  },
  [BreadcrumbsSize.Heading]: cappedSegmentWidthClassName,
};

/**
 * The focus ring's shape, shared by the segments and the ellipsis button. The
 * tiny trail draws the design's 1px offset around a 4px radius.
 */
export const focusRingClassName: Record<BreadcrumbsSize, string> = {
  [BreadcrumbsSize.Small]: 'rounded-xs focus-visible:outline-offset-2',
  [BreadcrumbsSize.Tiny]: 'rounded focus-visible:outline-offset-1',
  [BreadcrumbsSize.Heading]: 'rounded-xs focus-visible:outline-offset-2',
};

/** The box that draws a segment, around its icon and its label. */
export const segmentClassName =
  'flex min-w-0 flex-1 items-center gap-1 transition-colors';

/**
 * A segment the user can follow. Secondary until hovered, then accent — the
 * same pairing the kit's other inline links use.
 */
export const linkSegmentClassName =
  'text-secondary hover:text-accent focus-visible:outline focus-visible:outline-focus';

/**
 * The last segment: where the user is. Semibold and primary, and never a
 * link — a control that navigates to the page it is on has nothing to do.
 */
export const currentSegmentClassName = 'cursor-default text-primary';

/** A segment with nowhere to go: rendered, but not a control. */
export const staticSegmentClassName = 'cursor-default text-secondary';

/** The chevron between two segments. */
export const separatorClassName =
  'inline-flex flex-none items-center leading-none text-secondary';

/**
 * The collapsed-middle trigger. `dial-kit-minimum-target` lifts the 16px
 * glyph to the 24×24 of WCAG 2.5.8; the enhanced 44×44 target would overhang
 * the segments on either side of it (see the README exception table).
 */
export const overflowButtonClassName =
  'dial-kit-minimum-target flex shrink-0 items-center text-secondary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-focus';

/**
 * Smallest trail the collapse can produce: the root, the ellipsis and the
 * current page. Below that there is nothing left to hide behind the ellipsis.
 */
export const MIN_VISIBLE_ITEMS = 3;

/** Segments shown before the trail collapses. */
export const DEFAULT_MAX_VISIBLE_ITEMS = 4;

export const defaultSeparator: ReactNode = (
  <IconChevronRight
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
    // Mirrors the chevron in RTL, where the trail reads right to left.
    className="rtl:scale-x-[-1]"
  />
);
