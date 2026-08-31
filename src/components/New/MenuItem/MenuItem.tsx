import type { ButtonHTMLAttributes, FC, ReactNode, Ref } from 'react';

import { DialIcon } from '@/components/Icon/Icon';
import { CheckboxBox } from '@/components/New/Checkbox/CheckboxBox';
import { EllipsisTooltip } from '@/components/New/EllipsisTooltip/EllipsisTooltip';
import {
  overlayItemClassName,
  overlayItemDisabledClassName,
  overlayItemHighlightClassName,
  overlayItemSelectedClassName,
} from '@/components/New/constants/overlay';
import { MenuItemMark } from '@/types/menu-item';
import { mergeClasses } from '@/utils/merge-classes';

import { menuItemCheckIcon } from './constants';

export interface MenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ref to the row button — a submenu trigger anchors its panel to it. */
  ref?: Ref<HTMLButtonElement>;
  /** The row's text. */
  label?: ReactNode;
  /** Icon rendered before the label. */
  icon?: ReactNode;
  /** Secondary text rendered after the label, at the row's trailing edge. */
  description?: ReactNode;
  /** How a chosen row is marked. */
  mark?: MenuItemMark;
  /** Whether this row is the chosen one; drives whatever `mark` selects. */
  selected?: boolean;
  /** Paints the row in the error colour — a destructive action. */
  danger?: boolean;
  /** Node pinned to the row's trailing edge, e.g. a submenu caret. */
  trailing?: ReactNode;
  /**
   * A control of its own at the trailing edge — a favourite toggle, a delete
   * button. It is rendered as a **sibling** of the row, not inside it: a
   * button nested in a button is invalid, and it would swallow the row's
   * click and land inside its accessible name.
   */
  rightControl?: ReactNode;
  /** Truncates the label with a tooltip that only appears once it is clipped. */
  ellipsisLabel?: boolean;
  /** Additional classes for the label element. */
  labelClassName?: string;
  /** Replaces the icon + label content while keeping the row and `trailing`. */
  children?: ReactNode;
}

/**
 * One row of a floating overlay — a dropdown menu item or a select option.
 * Design system 2.0
 *
 * Owns the Menu-item states the design defines, so the dropdown and the select
 * cannot drift apart: rest, hover, focus and disable, plus the three ways a
 * chosen row is marked (`MenuItemMark`). The row itself is the control — the
 * checkbox box and the check icon are decorative, since the state already rides
 * on the `aria-checked`/`aria-selected` the caller sets alongside `role`.
 *
 * @example
 * ```tsx
 * <MenuItem role="menuitem" label="Rename" icon={<IconPencil />} />
 *
 * // Single choice, marked with a trailing check
 * <MenuItem role="option" aria-selected label="English" mark={MenuItemMark.Check} selected />
 *
 * // Current item of a navigation menu
 * <MenuItem role="menuitem" aria-current label="Settings" mark={MenuItemMark.Highlight} selected />
 * ```
 *
 * @param [label] - The row's text
 * @param [icon] - Icon rendered before the label
 * @param [description] - Secondary text at the row's trailing edge
 * @param [mark=MenuItemMark.None] - How a chosen row is marked
 * @param [selected=false] - Whether this row is the chosen one
 * @param [danger=false] - Paints the row in the error colour
 * @param [trailing] - Node pinned to the trailing edge, e.g. a submenu caret
 * @param [rightControl] - A control of its own at the trailing edge, rendered beside the row
 * @param [ellipsisLabel=false] - Truncate the label with a tooltip once clipped
 * @param [labelClassName] - Additional classes for the label element
 * @param [children] - Replaces the icon + label content
 * @param [className] - Additional classes for the row
 */
export const MenuItem: FC<MenuItemProps> = ({
  label,
  icon,
  description,
  mark = MenuItemMark.None,
  selected = false,
  danger = false,
  trailing,
  rightControl,
  ellipsisLabel = false,
  labelClassName,
  children,
  className,
  disabled = false,
  type = 'button',
  ...props
}) => {
  const isHighlighted = selected && mark === MenuItemMark.Highlight;
  const isTinted =
    selected && (mark === MenuItemMark.Checkbox || mark === MenuItemMark.Tint);

  /*
   * The tone rides on the icon and the label rather than on the row, so a
   * disabled row greys its content out even when `children` or a `danger`
   * colour has already claimed the row's own `text-*` class.
   */
  const toneClassName = mergeClasses(
    danger && 'text-error',
    disabled && 'text-control-disable-primary',
  );

  const rowClassName = mergeClasses(
    overlayItemClassName,
    // A row that opens a panel stays tinted while that panel is up, so the
    // trail back to it is visible once the pointer has moved into it.
    'aria-expanded:bg-control-accent-alpha-hover',
    isHighlighted && overlayItemHighlightClassName,
    isTinted && overlayItemSelectedClassName,
    disabled && overlayItemDisabledClassName,
    danger && 'text-error',
    className,
  );

  const row = (
    <button
      type={type}
      disabled={disabled}
      /*
        Beside a control of its own the row is only the left part of the
        rectangle, and the ring belongs around the whole of it — the wrapper
        draws it instead, off this button being the thing that is focused.
      */
      data-menu-item-row={rightControl ? '' : undefined}
      className={
        rightControl
          ? 'flex h-full min-w-0 flex-1 items-center gap-2 truncate text-start focus-visible:outline-none'
          : rowClassName
      }
      {...props}
    >
      {children ?? (
        <>
          {mark === MenuItemMark.Checkbox && (
            <CheckboxBox isSelected={selected} disabled={disabled} />
          )}

          {icon && <DialIcon icon={icon} className={toneClassName} />}

          {ellipsisLabel ? (
            <EllipsisTooltip
              text={label}
              className={mergeClasses(toneClassName, labelClassName)}
            />
          ) : (
            <span
              className={mergeClasses(
                'min-w-0 flex-1 truncate text-start',
                toneClassName,
                labelClassName,
              )}
            >
              {label}
            </span>
          )}

          {description && (
            <span
              className={mergeClasses(
                'shrink-0 text-secondary dial-small-text',
                disabled && 'text-control-disable-primary',
              )}
            >
              {description}
            </span>
          )}

          {selected && mark === MenuItemMark.Check && menuItemCheckIcon}
        </>
      )}

      {trailing && (
        <span className={mergeClasses('ml-auto shrink-0', toneClassName)}>
          {trailing}
        </span>
      )}
    </button>
  );

  if (!rightControl) return row;

  return (
    /*
      `role="none"` so the wrapper does not come between a listbox and its
      options: the row inside it keeps the role, the state and the click.
    */
    <div
      role="none"
      className={mergeClasses(
        rowClassName,
        'has-[[data-menu-item-row]:focus-visible]:outline',
        'has-[[data-menu-item-row]:focus-visible]:outline-focus',
      )}
    >
      {row}
      {rightControl}
    </div>
  );
};
