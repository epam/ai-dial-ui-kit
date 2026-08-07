import {
  IconCheck,
  IconChevronRight,
  IconClipboardX,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

import {
  overlayGap,
  overlayItemClassName,
  overlayItemDisabledClassName,
  overlayItemSelectedClassName,
  overlaySubMenuClassName,
} from '@/components/New/constants/overlay';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';

export const selectOverlayBaseClassName = mergeClasses('w-full flex flex-col');

export const selectOptionBaseClassName = mergeClasses(
  overlayItemClassName,
  // The row ends with a check icon, so label and mark sit at opposite edges.
  'justify-between',
);

export const selectOptionSelectedClassName = overlayItemSelectedClassName;

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

export const selectOptionDisabledClassName = overlayItemDisabledClassName;
export const dropdownMenuMaxHeight = 352;
export const selectSubMenuGap = overlayGap;
export const selectSubMenuClassName = overlaySubMenuClassName;

/** Marks an option that opens a nested list. Matches the dropdown's caret. */
export const selectSubMenuCaretIcon = (
  <IconChevronRight size={DIAL_ICON_SIZE.SM} aria-hidden="true" />
);

/** Classes for the chevron rendered as the field's trailing icon. */
export const selectFieldIconClassName = 'text-secondary transition-transform';

/**
 * Number of options below which the overlay's search row stays hidden: a list
 * short enough to scan at a glance does not need to be filtered.
 */
export const selectSearchThreshold = 8;

export const selectSearchIcon = (
  <IconSearch size={DIAL_ICON_SIZE.MD} aria-hidden="true" />
);

export const selectCloseIcon = (
  <IconX size={DIAL_ICON_SIZE.SM} aria-hidden="true" />
);

/** Marks the selected option in single mode, alongside its tinted row. */
export const selectOptionCheckIcon = (
  <IconCheck
    size={DIAL_ICON_SIZE.SM}
    className="shrink-0 text-accent"
    aria-hidden
  />
);

export const selectEmptyStateIcon = (
  <IconClipboardX size={DIAL_ICON_SIZE.LG} stroke={0.5} aria-hidden="true" />
);
