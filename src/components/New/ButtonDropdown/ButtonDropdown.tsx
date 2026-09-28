import { useMemo, useState, type FC } from 'react';

import type { DropdownItem } from '@/models/dropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button, type ButtonProps } from '../Button/Button';
import { Dropdown, type DropdownProps } from '../Dropdown/Dropdown';
import { getButtonChevron } from './constants';
import { DIAL_KIT_CLASS } from '@/constants/public-class-names';

export interface ButtonDropdownProps extends Omit<ButtonProps, 'iconAfter'> {
  items: DropdownItem[];
  /** Menu options forwarded to the underlying `Dropdown`: the panel class and whether the panel matches the button's width. */
  dropdownProps?: Pick<DropdownProps, 'listClassName' | 'matchReferenceWidth'>;
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
 * @param [dropdownProps] - `listClassName` and `matchReferenceWidth` forwarded to the menu `Dropdown`
 */
export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  variant,
  appearance,
  items,
  dropdownProps,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const icon = useMemo(() => {
    return getButtonChevron(isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div className={DIAL_KIT_CLASS.buttonDropdown}>
      <Dropdown
        {...dropdownProps}
        items={items}
        onOpenChange={(open) => setIsDropdownOpen(open)}
      >
        <Button
          {...props}
          iconAfter={icon}
          variant={variant || ButtonVariant.Primary}
          appearance={appearance || ButtonAppearance.Solid}
          aria-haspopup="menu"
          aria-expanded={isDropdownOpen}
        />
      </Dropdown>
    </div>
  );
};
