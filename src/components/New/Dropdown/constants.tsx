import { IconChevronRight } from '@tabler/icons-react';
import classNames from 'classnames';

import {
  overlayGap,
  overlayItemClassName,
  overlayItemDisabledClassName,
  overlaySurfaceClassName,
} from '@/components/New/constants/overlay';
import { DIAL_ICON_SIZE } from '@/constants/icon';

export const dropdownBaseClassName = classNames(
  'flex items-center gap-2 align-middle',
  'h-auto px-0 bg-transparent border-0',
);

export const dropdownListBaseClassName = classNames(
  'z-[53] focus-visible:outline-none',
  overlaySurfaceClassName,
);

export const dropdownItemBaseClassName = overlayItemClassName;

export const dropdownItemDisabledClassName = classNames(
  overlayItemDisabledClassName,
  '!cursor-not-allowed',
);

export const dropdownItemDangerClassName = 'text-error';

export const dropdownDividerClassName = 'my-1 border-t border-secondary';

export const dropdownGap = overlayGap;

export const submenuCaretIcon = (
  <IconChevronRight size={DIAL_ICON_SIZE.SM} aria-hidden="true" />
);
