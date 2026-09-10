import type { ReactNode } from 'react';

import type { TooltipPlacement } from '@/types/tooltip';

/**
 * Data for the interactive panel {@link Select} anchors to an option's row —
 * unlike a plain tooltip, its content can hold controls of its own (a "View
 * details" link, for example), which is why it takes a full node rather than
 * a string.
 */
export interface SelectOptionInteractiveTooltip {
  content: ReactNode;
  /** @default TooltipPlacement.Right */
  placement?: TooltipPlacement;
  /**
   * Additional CSS classes for the panel — e.g. a wider `max-w-*` for content
   * that does not fit the default 320px.
   */
  contentClassName?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  /**
   * Custom node rendered in place of `label` in the option list, trigger and
   * submenu. `label` is still used for filtering/search matching and as the
   * accessible name, so keep it as a plain-text representation of `labelNode`.
   */
  labelNode?: ReactNode;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  /**
   * A control of its own at the row's trailing edge — a favourite toggle, a
   * delete button. It is rendered beside the row rather than inside it, so it
   * keeps its own click and stays out of the row's accessible name.
   */
  rightControl?: ReactNode;
  /**
   * Anchors an {@link InteractiveTooltip} to this option's row, open on hover
   * or focus. Use it for content too rich for `description` — an explanation
   * with its own link or button, the way a skill picker explains what a
   * skill does before it is chosen.
   */
  interactiveTooltip?: SelectOptionInteractiveTooltip;
  children?: SelectOption[];
}
