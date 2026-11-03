import { useMemo, useState, type FC } from 'react';

import type { DropdownItem } from '@/models/dropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button, type ButtonProps } from '../Button/Button';
import { Dropdown, type DropdownProps } from '../Dropdown/Dropdown';
import { getButtonChevron } from './constants';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

export interface ButtonDropdownProps extends ButtonProps {
  items: DropdownItem[];
  /** Controlled open state. When omitted, the button manages its own state. */
  open?: boolean;
  /** Initial open state for an uncontrolled button. Defaults to `false`. */
  defaultOpen?: boolean;
  /** Called when an interaction requests opening or closing the menu. */
  onOpenChange?: (open: boolean) => void;
  /** Menu presentation and search options forwarded to `Dropdown`. */
  dropdownProps?: Omit<
    DropdownProps,
    | 'children'
    | 'items'
    | 'renderOverlay'
    | 'open'
    | 'defaultOpen'
    | 'onOpenChange'
    | 'disabled'
  >;
}

/**
 * A Button dropdown component based on the Dropdown component
 * aliases: SplitButton|MenuButton
 * Design system 2.0
 *
 * @example
 * ```tsx
 * <ButtonDropdown
 *   title="Click me"
 *   variant={ButtonVariant.Neutral}
 *   items={[{ key: 'profile', label: 'Profile' }, { key: 'logout', label: 'Logout' }]}
 * />
 * ```
 *
 * Inherits all props from Button.
 * @param [items] - DropdownItems with actions
 * @param [dropdownProps] - Menu presentation and search options forwarded to `Dropdown`
 * @param [open] - Controlled open state
 * @param [defaultOpen=false] - Initial uncontrolled open state
 * @param [onOpenChange] - Called when the menu requests a state change
 * @param [iconAfter] - Replaces the default rotating chevron; pass `null` to hide it
 */
export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  variant,
  appearance,
  items,
  dropdownProps,
  open,
  defaultOpen = false,
  onOpenChange,
  disabled,
  iconAfter,
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isDropdownOpen = open ?? internalOpen;
  const icon = useMemo(() => {
    return getButtonChevron(isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div className={DIAL_KIT_CLASS.buttonDropdown}>
      <Dropdown
        {...dropdownProps}
        overlayAriaLabel={
          dropdownProps?.overlayAriaLabel ?? props['aria-label']
        }
        items={items}
        disabled={disabled}
        open={isDropdownOpen}
        onOpenChange={(nextOpen) => {
          if (open === undefined) setInternalOpen(nextOpen);
          onOpenChange?.(nextOpen);
        }}
      >
        <Button
          {...props}
          iconAfter={iconAfter === undefined ? icon : iconAfter}
          disabled={disabled}
          variant={variant || ButtonVariant.Primary}
          appearance={appearance || ButtonAppearance.Solid}
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
        />
      </Dropdown>
    </div>
  );
};
