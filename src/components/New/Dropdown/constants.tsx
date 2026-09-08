import { IconChevronRight } from '@tabler/icons-react';

import {
  overlayGap,
  overlayItemClassName,
  overlaySubMenuClassName,
  overlaySurfaceClassName,
} from '@/components/New/constants/overlay';
import { DIAL_KIT_ICON_STROKE } from '@/components/New/constants/icon';
import { DIAL_ICON_SIZE } from '@/constants/icon';
import { mergeClasses } from '@/utils/merge-classes';

export const dropdownBaseClassName = mergeClasses(
  'flex items-center gap-2 align-middle',
  'h-auto px-0 bg-transparent border-0',
);

export const dropdownListBaseClassName = mergeClasses(
  'z-[53] focus-visible:outline-none',
  overlaySurfaceClassName,
);

export const dropdownSubMenuClassName = overlaySubMenuClassName;

/**
 * The row's own styling lives in {@link MenuItem}, which renders every item of
 * the menu. This alias is what a fully custom overlay row can lean on to match
 * them.
 */
export const dropdownItemBaseClassName = overlayItemClassName;

export const dropdownDividerClassName = 'my-1 border-t border-tertiary';

export const dropdownGap = overlayGap;

export const submenuCaretIcon = (
  <IconChevronRight
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);
