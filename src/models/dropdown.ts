import type { DropdownItemType } from '@/types/dropdown';
import type { ReactNode, MouseEvent } from 'react';

export interface DropdownSubMenuHoverOptions {
  /** Delay (ms) before the submenu opens/closes on hover. Defaults to `{ open: 80, close: 80 }`. */
  delay?: number | { open?: number; close?: number };
  /** Whether pointer movement (not just rest) can trigger the hover open. Defaults to `false`. */
  move?: boolean;
}

export interface DropdownItem {
  key: string;
  label?: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  danger?: boolean;
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
  /** Overrides the default hover-open behavior of this item's submenu. */
  subMenuHoverOptions?: DropdownSubMenuHoverOptions;
}
