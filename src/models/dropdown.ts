import type { DropdownItemType } from '@/types/dropdown';
import type { MenuItemMark } from '@/types/menu-item';
import type { TooltipPlacement } from '@/types/tooltip';
import type { ReactNode, MouseEvent } from 'react';

export interface DropdownSubMenuHoverOptions {
  /** Delay (ms) before the submenu opens/closes on hover. Defaults to `{ open: 80, close: 80 }`. */
  delay?: number | { open?: number; close?: number };
  /** Whether pointer movement (not just rest) can trigger the hover open. Defaults to `false`. */
  move?: boolean;
}

/**
 * Data for the interactive panel {@link Dropdown} anchors to an item's row —
 * unlike a plain tooltip, its content can hold controls of its own (a "View
 * details" link, for example), which is why it takes a full node rather than
 * a string.
 */
export interface DropdownItemInteractiveTooltip {
  content: ReactNode;
  /** @default TooltipPlacement.Right */
  placement?: TooltipPlacement;
  /**
   * Additional CSS classes for the panel — e.g. a wider `max-w-*` for content
   * that does not fit the default 320px.
   */
  contentClassName?: string;
}

export interface DropdownItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  /**
   * Renders the item as a multiselect row: a checkbox box before the label, the
   * accent tint while checked, and a click that leaves the menu open. The row is
   * a `menuitemcheckbox` whose state lives on `aria-checked`; the box itself is
   * decorative. Keep `checked` in your own state and update it from the item's
   * `onClick` (or the dropdown's `onItemClick`).
   */
  selectable?: boolean;
  /**
   * How this item is marked while `checked`, straight from the design's
   * Menu-item states: a trailing check (`Check`, a single choice that closes
   * the menu), a leading checkbox box (`Checkbox`, the multiselect row that
   * keeps the menu open) or an accent tint (`Highlight`, the current item of
   * a navigation menu). Defaults to `Checkbox` for a `selectable` item and to
   * `None` otherwise.
   */
  mark?: MenuItemMark;
  /** Whether a marked item is currently checked. */
  checked?: boolean;
  /**
   * A control of its own at the row's trailing edge — a favourite toggle, a
   * delete button. It is rendered beside the row rather than inside it, so it
   * keeps its own click and stays out of the row's accessible name.
   */
  rightControl?: ReactNode;
  type?: DropdownItemType;
  className?: string;
  onClick?: (info: { key: string; domEvent: MouseEvent }) => void;
  children?: DropdownItem[];
  /** Content rendered above the children list in this item's submenu panel. */
  menuHeader?: ReactNode | (() => ReactNode);
  /** Content rendered below the children list in this item's submenu panel. */
  menuFooter?: ReactNode | (() => ReactNode);
  /**
   * Fully replaces the submenu panel content (children/menuHeader/menuFooter are ignored).
   * Use this to show a custom popup — e.g. a preview or a picker — instead of a plain item list.
   */
  renderSubMenu?: () => ReactNode;
  /**
   * Replaces this item's icon + label content while keeping its button element, click
   * handling, and (for a submenu trigger) the caret intact. Use this for lighter-weight
   * customization — e.g. a badge or avatar next to the label — without giving up the
   * default row/list wiring the way `renderSubMenu` does.
   */
  renderItem?: (item: DropdownItem) => ReactNode;
  /** Overrides the default hover-open behavior of this item's submenu. */
  subMenuHoverOptions?: DropdownSubMenuHoverOptions;
  /**
   * Anchors an {@link InteractiveTooltip} to this item's row, open on hover
   * or focus. Use it for content too rich for a plain label — an explanation
   * with its own link or button.
   */
  interactiveTooltip?: DropdownItemInteractiveTooltip;
}
