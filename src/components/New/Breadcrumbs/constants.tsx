import { IconChevronRight } from '@tabler/icons-react';
import type { ReactNode } from 'react';

import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { BreadcrumbsSize } from '@/types/breadcrumbs';

/**
 * The `<nav>`. It clips rather than wraps: a breadcrumb that reflows onto a
 * second line moves the content below it, so the trail truncates its segments
 * instead (see `segmentWidthClassName`).
 */
export const navClassName = 'w-full overflow-hidden';

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
  [BreadcrumbsSize.Heading]: 'dial-h2-text',
};

/**
 * The current page is always semibold. `dial-h2-text` already is, so the
 * heading trail repeats its own token rather than reaching for a semibold
 * variant that does not exist.
 */
export const currentSizeClassName: Record<BreadcrumbsSize, string> = {
  [BreadcrumbsSize.Small]: 'dial-small-semi-text',
  [BreadcrumbsSize.Heading]: 'dial-h2-text',
};

/**
 * How each segment gives up width when the trail does not fit. The root keeps
 * its full label — it is the anchor the user navigates back to — the middle
 * segments truncate first, and the current page keeps the largest share of
 * what is left, since it names where the user actually is.
 */
export const segmentWidthClassName: Record<
  'first' | 'middle' | 'last',
  string
> = {
  first: 'shrink-0',
  middle: 'min-w-0 max-w-[30%] shrink',
  last: 'min-w-0 max-w-[51%] shrink',
};

/** The box that draws a segment, around its icon and its label. */
export const segmentClassName =
  'flex min-w-0 flex-1 items-center gap-1 rounded-sm transition-colors';

/**
 * A segment the user can follow. Secondary until hovered, then accent — the
 * same pairing the kit's other inline links use.
 */
export const linkSegmentClassName =
  'text-secondary hover:text-accent focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-focus';

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
  'dial-kit-minimum-target flex shrink-0 items-center rounded-sm text-secondary transition-colors hover:text-accent focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-focus';

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
    // eslint-disable-next-line tailwindcss/no-unnecessary-arbitrary-value -- mirrors the chevron in RTL, where the trail reads right to left
    className="rtl:scale-x-[-1]"
  />
);
