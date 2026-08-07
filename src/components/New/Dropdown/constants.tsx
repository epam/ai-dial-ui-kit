import { IconChevronRight } from '@tabler/icons-react';

import {
  overlayGap,
  overlayItemClassName,
  overlayItemDisabledClassName,
  overlaySubMenuClassName,
  overlaySurfaceClassName,
} from '@/components/New/constants/overlay';
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

export const dropdownItemBaseClassName = overlayItemClassName;

export const dropdownItemDisabledClassName = mergeClasses(
  overlayItemDisabledClassName,
  '!cursor-not-allowed',
);

export const dropdownItemDangerClassName = 'text-error';

export const dropdownDividerClassName = 'my-1 border-t border-secondary';

export const dropdownGap = overlayGap;

export const submenuCaretIcon = (
  <IconChevronRight size={DIAL_ICON_SIZE.SM} aria-hidden="true" />
);
