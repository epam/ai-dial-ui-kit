import {
  IconChevronRight,
  IconClipboardX,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

import {
  overlayGap,
  overlayItemClassName,
  overlaySubMenuClassName,
} from '@/components/New/constants/overlay';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';

export const selectOverlayBaseClassName = mergeClasses('w-full flex flex-col');

/**
 * A row of the option list. The options themselves are {@link MenuItem}s; this
 * is what the list's own non-option rows — Select All — align to.
 */
export const selectOptionBaseClassName = overlayItemClassName;

/**
 * Holds the option list to the width of the field.
 *
 * `Dropdown` only pins the overlay's *min* width to the trigger and lets
 * `max-width` run to the available viewport width — as an inline style, so a
 * single long label stretches the list across the screen and only `!important`
 * can rein it back in. `--reference-width` is the trigger width the dropdown
 * publishes, and it is set whenever `matchReferenceWidth` is left on (the
 * default this component relies on).
 */
export const selectListWidthClassName = '!max-w-[var(--reference-width)]';

/**
 * The options themselves scroll, at the design's maximum list length of
 * 344px — not the panel around them, so the search row and Select All stay
 * put while the list moves under them. The panel keeps its own cap on the
 * available viewport height, which takes over on a screen too short for this
 * one.
 */
export const selectOptionsScrollClassName = 'max-h-[344px] overflow-y-auto';
export const selectSubMenuGap = overlayGap;
export const selectSubMenuClassName = overlaySubMenuClassName;

/** Marks an option that opens a nested list. Matches the dropdown's caret. */
export const selectSubMenuCaretIcon = (
  <IconChevronRight
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);

/** Classes for the chevron rendered as the field's trailing icon. */
export const selectFieldIconClassName = 'text-secondary transition-transform';

/**
 * Number of options below which the overlay's search row stays hidden: a list
 * short enough to scan at a glance does not need to be filtered.
 */
export const selectSearchThreshold = 8;

export const selectSearchIcon = (
  <IconSearch
    size={DIAL_ICON_SIZE.MD}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);

export const selectCloseIcon = (
  <IconX
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);

export const selectEmptyStateIcon = (
  <IconClipboardX size={DIAL_ICON_SIZE.LG} stroke={0.5} aria-hidden="true" />
);
