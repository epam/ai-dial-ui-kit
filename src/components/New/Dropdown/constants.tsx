import { IconChevronRight } from '@tabler/icons-react';

import {
  overlayGap,
  overlayItemClassName,
  overlayListClassName,
  overlaySubMenuClassName,
  overlaySubMenuListClassName,
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
  'z-floating focus-visible:outline-hidden',
  overlaySurfaceClassName,
);

export const dropdownSubMenuClassName = overlaySubMenuClassName;
export const dropdownSubMenuListClassName = overlaySubMenuListClassName;

/** The top-level item list: rows 2px apart, inset from the panel edge. */
export const dropdownItemListClassName = mergeClasses(
  overlayListClassName,
  'py-1',
);

/**
 * The row's own styling lives in {@link MenuItem}, which renders every item of
 * the menu. This alias is what a fully custom overlay row can lean on to match
 * them.
 */
export const dropdownItemBaseClassName = overlayItemClassName;

export const dropdownDividerClassName = 'my-1 border-t border-tertiary';

/** The search row of a `searchable` dropdown: pinned above the item list, which scrolls on its own. */
export const dropdownSearchClassName = 'shrink-0 px-1 pt-1';

/** The no-results line of a `searchable` dropdown, styled as a `PlainText` row. */
export const dropdownNoResultsClassName =
  'px-3 py-2 text-secondary dial-caption-text';

/*
 * Mirrors `overlayItemClassName`'s `h-[40px]`, `overlayListClassName`'s
 * `gap-0.5` and `dropdownItemListClassName`'s `py-1`.
 */
const DROPDOWN_ROW_HEIGHT_PX = 40;
const DROPDOWN_ROW_GAP_PX = 2;
const DROPDOWN_LIST_INSET_PX = 8;

/** Height of the item list that shows exactly `rows` rows before it scrolls. */
export const getDropdownListHeight = (rows: number): number =>
  rows * DROPDOWN_ROW_HEIGHT_PX +
  Math.max(rows - 1, 0) * DROPDOWN_ROW_GAP_PX +
  DROPDOWN_LIST_INSET_PX;

export const dropdownGap = overlayGap;

export const submenuCaretIcon = (
  <IconChevronRight
    size={DIAL_ICON_SIZE.SM}
    stroke={DIAL_KIT_ICON_STROKE}
    aria-hidden="true"
  />
);
