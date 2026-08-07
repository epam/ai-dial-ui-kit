import {
  IconCheck,
  IconClipboardX,
  IconSearch,
  IconX,
} from '@tabler/icons-react';

import { DIAL_ICON_SIZE } from '@/constants/icon';

export const selectOverlayBaseClassName = 'w-full rounded flex flex-col';

export const selectOptionBaseClassName =
  'flex w-full items-center justify-between gap-2 px-3 h-[34px] dial-small-text text-primary truncate hover:bg-accent-primary-alpha focus:bg-accent-primary-alpha focus:outline-none';

export const selectOptionSelectedClassName = 'bg-accent-primary-alpha';

export const selectOptionSingleSelectedClassName =
  'bg-accent-primary-alpha border-l border-accent-primary border-1';

export const selectOptionDisabledClassName = 'opacity-75';
export const dropdownMenuMaxHeight = 352;
export const selectSubMenuGap = 4;

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
