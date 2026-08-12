import { useMemo, useState, type FC } from 'react';

import type { DropdownItem } from '@/models/dropdown';
import { ButtonAppearance, ButtonVariant } from '@/types/button';
import { Button, type ButtonProps } from '../Button/Button';
import { Dropdown } from '../Dropdown/Dropdown';
import { getButtonChevron } from './constants';

export interface ButtonDropdownProps extends Omit<ButtonProps, 'iconAfter'> {
  items: DropdownItem[];
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
 */
export const ButtonDropdown: FC<ButtonDropdownProps> = ({
  variant,
  appearance,
  items,
  ...props
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const icon = useMemo(() => {
    return getButtonChevron(isDropdownOpen);
  }, [isDropdownOpen]);

  return (
    <div>
      <Dropdown items={items} onOpenChange={(open) => setIsDropdownOpen(open)}>
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
